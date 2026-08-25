const WHATSAPP_API_VERSION = process.env.WHATSAPP_API_VERSION || "v21.0";
const WHATSAPP_PHONE_NUMBER_ID = process.env.WHATSAPP_PHONE_NUMBER_ID;
const WHATSAPP_ACCESS_TOKEN = process.env.WHATSAPP_ACCESS_TOKEN;
const WHATSAPP_COUNTRY_CODE = process.env.WHATSAPP_COUNTRY_CODE || "55";
const WHATSAPP_ENABLED = process.env.WHATSAPP_ENABLED === "true";

const STATUS_MESSAGES = {
    "em atendimento": (nomeCliente, modelo, placa) =>
        `Olá, ${nomeCliente}! Informamos que seu veículo ${modelo} - ${placa} entrou em lavagem. Assim que o serviço for finalizado, avisaremos você novamente.`,
    "finalizado": (nomeCliente, modelo, placa) =>
        `Olá, ${nomeCliente}! Informamos que seu veículo ${modelo} - ${placa} foi finalizado. Obrigado pela preferência!`,
};

const sanitizePhone = (phone) => {
    return phone.replace(/\D/g, "");
};

const formatPhone = (phone) => {
    let cleaned = sanitizePhone(phone);

    if (cleaned.length === 11 && cleaned.startsWith("0")) {
        cleaned = cleaned.substring(1);
    }

    if (cleaned.length === 10 || cleaned.length === 11) {
        cleaned = `${WHATSAPP_COUNTRY_CODE}${cleaned}`;
    }

    return cleaned;
};

const sendWhatsAppMessage = async (to, message) => {
    if (!WHATSAPP_ENABLED) {
        console.log("[WhatsApp] Desabilitado via env - mensagem não enviada");
        return null;
    }

    if (!WHATSAPP_ACCESS_TOKEN || !WHATSAPP_PHONE_NUMBER_ID) {
        console.error("[WhatsApp] Variáveis de ambiente não configuradas (ACCESS_TOKEN ou PHONE_NUMBER_ID)");
        return null;
    }

    const formattedPhone = formatPhone(to);

    const url = `https://graph.facebook.com/${WHATSAPP_API_VERSION}/${WHATSAPP_PHONE_NUMBER_ID}/messages`;

    try {
        const response = await fetch(url, {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${WHATSAPP_ACCESS_TOKEN}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                messaging_product: "whatsapp",
                to: formattedPhone,
                type: "text",
                text: {
                    body: message,
                },
            }),
        });

        const data = await response.json();

        if (!response.ok) {
            console.error("[WhatsApp] Erro na API:", response.status, data.error?.message || "Erro desconhecido");
            return null;
        }

        console.log("[WhatsApp] Mensagem enviada com sucesso para:", formattedPhone);
        return data;
    } catch (error) {
        console.error("[WhatsApp] Erro de conexão:", error.message);
        return null;
    }
};

export const notifyStatusChange = async (veiculo, novoStatus) => {
    const templateFn = STATUS_MESSAGES[novoStatus];

    if (!templateFn) {
        return null;
    }

    const { nomeCliente, contato, modelo, placa } = veiculo;

    if (!contato) {
        console.warn(`[WhatsApp] Veículo ${placa} sem telefone - notificação ignorada`);
        return null;
    }

    const message = templateFn(nomeCliente, modelo, placa);

    return sendWhatsAppMessage(contato, message);
};
