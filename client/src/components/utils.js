export function generateChatId(uid1, uid2) {

    if (!uid1 || !uid2) {
        console.error("❌ generateChatId received invalid UIDs:", uid1, uid2);
        return null;
    }

    const sortedIds = [uid1, uid2].sort();
    return `${sortedIds[0]}_${sortedIds[1]}`;
}
