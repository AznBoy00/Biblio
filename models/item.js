
module.exports.constructor = constructor;

function constructor(item_id, discriminator, properties) {
    return {item_id: item_id, discriminator: discriminator, properties: properties}
}
