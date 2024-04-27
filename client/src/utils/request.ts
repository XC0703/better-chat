/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from 'axios';

import type {
	AxiosInstance,
	AxiosRequestConfig,
	InternalAxiosRequestConfig,
	AxiosResponse,
	AxiosError
} from 'axios';

import { apiBaseURL } from '@/config';

interface ApiResponse<T> {
	code: number;
	message: string; // 用一个更具体的字段来描述错误信息
	data: T;
}

export class Request {
	private instance: AxiosInstance;
	private defaultConfig: AxiosRequestConfig = { baseURL: apiBaseURL, timeout: 6000 };

	constructor(config: AxiosRequestConfig) {
		const mergedConfig = { ...this.defaultConfig, ...config }; // 使用浅拷贝
		this.instance = axios.create(mergedConfig);

		this.instance.interceptors.request.use(
			(config: InternalAxiosRequestConfig) => {
				const token = this.getToken(); // 使用一个独立的方法来获取 token
				if (token) {
					config.headers.Authorization = token;
				}
				return config;
			},
			(error: AxiosError) => {
				return Promise.reject(error);
			}
		);

		this.instance.interceptors.response.use(
			(response: AxiosResponse) => {
				return response;
			},
			(error: AxiosError) => {
				const apiError = error.response?.data; // 修改到更具体的错误信息字段
				return Promise.reject(apiError);
			}
		);
	}

	public request(config: AxiosRequestConfig): Promise<any> {
		return this.instance.request(config);
	}

	public get<TResponse = any>(
		url: string,
		config?: AxiosRequestConfig
	): Promise<AxiosResponse<ApiResponse<TResponse>>> {
		return this.instance.get(url, config);
	}

	public post<TRequest = any, TResponse = any>(
		url: string,
		data?: TRequest,
		config?: AxiosRequestConfig
	): Promise<AxiosResponse<ApiResponse<TResponse>>> {
		return this.instance.post(url, data, config);
	}

	public put<TRequest = any, TResponse = any>(
		url: string,
		data?: TRequest,
		config?: AxiosRequestConfig
	): Promise<AxiosResponse<ApiResponse<TResponse>>> {
		return this.instance.put(url, data, config);
	}

	public delete<TResponse = any>(
		url: string,
		config?: AxiosRequestConfig
	): Promise<AxiosResponse<ApiResponse<TResponse>>> {
		return this.instance.delete(url, config);
	}

	private getToken(): string | null {
		return JSON.parse(sessionStorage.getItem('better-chat.authToken') || 'null');
	}
}

export default new Request({});
