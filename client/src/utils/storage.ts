export const sessionStorageKey = 'better-chat.';

interface ISessionStorage<T> {
	key: string;
	defaultValue: T;
}
// 重新封装的 sessionStorage
export class Storage<T> implements ISessionStorage<T> {
	key: string;

	defaultValue: T;

	constructor(key: string, defaultValue: T) {
		this.key = sessionStorageKey + key;
		this.defaultValue = defaultValue;
	}

	setItem(value: T) {
		sessionStorage.setItem(this.key, JSON.stringify(value));
	}

	getItem(): T {
		const value = sessionStorage[this.key] && sessionStorage.getItem(this.key);
		if (value === undefined) return this.defaultValue;
		try {
			return value && value !== 'null' && value !== 'undefined'
				? (JSON.parse(value) as T)
				: this.defaultValue;
		} catch {
			return value && value !== 'null' && value !== 'undefined'
				? (value as unknown as T)
				: this.defaultValue;
		}
	}

	removeItem() {
		sessionStorage.removeItem(this.key);
	}
}

/** 管理 token */
export const tokenStorage = new Storage<string>('authToken', '');
/** 管理用户信息 */
export const userStorage = new Storage<string>('userInfo', '');

/** 只清除当前项目所属的本地存储 */
export const clearSessionStorage = () => {
	for (const key in sessionStorage) {
		if (key.includes(sessionStorageKey)) {
			sessionStorage.removeItem(key);
		}
	}
};
