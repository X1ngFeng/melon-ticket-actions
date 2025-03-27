"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core = require("@actions/core");
const axios_1 = require("axios");
const qs = require("querystring");

(async () => {
    var _a;
    // Validate parameters
    const [productId, scheduleId, seatId, webhookUrl] = [
        "product-id",
        "schedule-id",
        "seat-id",
        "discord-incoming-webhook-url",  // 修改參數名稱為 Discord Webhook URL
    ].map((name) => {
        const value = core.getInput(name);
        if (!value) {
            throw new Error(`melon-ticket-actions: Please set ${name} input parameter`);
        }
        return value;
    });
    const message = (_a = core.getInput("message")) !== null && _a !== void 0 ? _a : "티켓사세요";

    // 發送 Discord 通知的函式
    const sendDiscordNotification = async (content: string) => {
        try {
            await axios_1.default.post(webhookUrl, {
                content: content,
            });
        } catch (error) {
            console.error("Failed to send Discord notification:", error);
        }
    };

    // 向 Melon Ticket API 發送請求
    const res = await axios_1.default({
        method: "POST",
        url: "https://ticket.melon.com/tktapi/product/seatStateInfo.json",
        params: {
            v: "1",
        },
        data: qs.stringify({
            prodId: productId,
            scheduleNo: scheduleId,
            seatId,
            volume: 1,
            selectedGradeVolume: 1,
        }),
    });
    
    // Debug 訊息
    console.log("Got response: ", res.data);

    // 如果票券可用，發送 Discord 通知
    if (res.data.chkResult) {
        const link = `http://ticket.melon.com/performance/index.htm?${qs.stringify({
            prodId: productId,
        })}`;
        await sendDiscordNotification(`${message} ${link}`);
    }
})().catch((e) => {
    console.error(e.stack); // tslint:disable-line
    core.setFailed(e.message);
});
