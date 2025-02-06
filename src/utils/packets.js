export default {
    findPacket (callback) {
        let packetsObj = hooks.findModule("Type.forSchema({");
        let packetSchemas = Object.values(packetsObj).filter(p => typeof p === "object")[1];
        let packetIndex = Object.values(packetSchemas).findIndex(callback);
        return Object.keys(packetSchemas)[packetIndex];
    },

    get placeBlock () {
        return this.findPacket(packetSchema => packetSchema.fields?.[2]?.name == "checker");
    } 
}