import { contextBridge, ipcRenderer } from "electron";
import sharp from "sharp";
import { DataTypes, Sequelize } from 'sequelize';

const sequelize = new Sequelize('sqlite::memory:')

const User = sequelize.define('User', {
	firstName: {
		type: DataTypes.STRING,
	},
	lastName: {
		type: DataTypes.STRING,
	},
});

async function makeThumbnail(picture: ArrayBuffer): Promise<string> {
	const destinationFolder = await ipcRenderer.invoke('ask-and-write-base64', Buffer.from(picture).toString('base64'))
	const destinationPath = `${destinationFolder}.resized.png`

	await sharp(picture).resize({ height: 50 })
		.png()
		.toFile(destinationPath);

	return await ipcRenderer.invoke('get-file-content-as-base64', destinationPath)
}

contextBridge.exposeInMainWorld('app', {
	makeThumbnail: async (picture: ArrayBuffer) => await makeThumbnail(picture),
	storeUser: async (firstName: string, lastName: string) => {
		await User.sync({ force: true });
		await User.create({ firstName, lastName });

		return (await User.findAll()).map(s => s.toJSON())
	},
})