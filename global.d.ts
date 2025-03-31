export type User = {
	firstName: string,
	lastName: string,
}

export interface IApp {
	makeThumbnail(picture: ArrayBuffer): Promise<ArrayBuffer>,
	storeUser(firstName: string, lastName: string): Promise<User[]>,
}

declare global {
	interface Window {
		app: IApp
	}
}