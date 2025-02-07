export default {
    findPacket (callback) {
        let packetsObj = hooks.findModule("Type.forSchema({");
        let packetSchemas = Object.values(packetsObj).filter(p => typeof p === "object");
        let packet;
        packetSchemas.forEach(packetSchema => {
            let packetIndex = Object.values(packetSchema)?.findIndex(callback) || -1;
            if (packetIndex !== -1) {
                packet = Object.keys(packetSchema)[packetIndex];
            }
        })
        return packet;
    },

    get placeBlock () {
        return this.findPacket(packetSchema => packetSchema?.fields?.[2]?.name == "checker");
    },

    get changeSkin () {
        return this.findPacket(packetSchema => packetSchema?.fields?.[0]?.name == "partType");
    }
}