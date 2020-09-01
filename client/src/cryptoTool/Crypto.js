const openpgp = require('openpgp');

const generateNewPair = async (name_i, email_i, secret, rsa_bits = 4096) => {
    const key = await openpgp.generateKey({
        userIds: [{ name: name_i, email: email_i }],
        rsaBits: rsa_bits,
        passphrase: secret
    });
    return key;
}

const encrypt = async (text, public_key) => {
    try {
        const publicKey = (await openpgp.key.readArmored(public_key)).keys[0];
        const result = await openpgp.encrypt({
            message: openpgp.message.fromText(text),
            publicKeys: publicKey
        })
        return result.data;
    } catch (error) {
        return error;
    }
}

const decrypt = async (text, private_key, password) => {
    try {
        const { keys: [privateKey] } = await openpgp.key.readArmored(private_key);
        await privateKey.decrypt(password);
        const result = await openpgp.decrypt({
            message: await openpgp.message.readArmored(text),
            privateKeys: [privateKey]
        });

        return result.data;
    } catch (error) {
        return error;
    }
}

export default { generateNewPair, encrypt, decrypt }
