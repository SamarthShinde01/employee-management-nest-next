"use client";

import axios from "axios";

const API = axios.create({
	baseURL: process.env.NEXT_PUBLIC_API_URL,
	withCredentials: true,
});

API.interceptors.response.use(
	(response) => response.data,
	async (error) => {
		const { response } = error;
		const { status, data } = response || {};

		return Promise.reject({ status, ...data });
	}
);

export default API;
