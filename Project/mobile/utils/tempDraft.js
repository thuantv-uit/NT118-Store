import { Platform } from 'react-native';
let AsyncStorage;
try {
	AsyncStorage = require('@react-native-async-storage/async-storage').default;
} catch (e) {
	AsyncStorage = null;
}

const STORAGE_KEY = 'seller_create_product_draft_v1';
const draft = { data: null };

function deepClone(obj) {
	try {
		return JSON.parse(JSON.stringify(obj));
	} catch (e) {
		return { ...obj };
	}
}

export async function saveDraft(obj) {
	draft.data = deepClone(obj);
	console.log('[tempDraft] saved draft (async)');
	if (AsyncStorage) {
		try {
			await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(draft.data));
		} catch (e) {
			console.warn('[tempDraft] AsyncStorage save failed', e.message || e);
		}
	}
}

// synchronous variant used before navigation: sets in-memory and writes to AsyncStorage in background
export function saveDraftSync(obj) {
	draft.data = deepClone(obj);
	console.log('[tempDraft] saved draft (sync)');
	if (AsyncStorage) {
		AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(draft.data)).catch((e) => console.warn('[tempDraft] AsyncStorage save failed', e && e.message));
	}
}

export async function getDraft() {
	if (draft.data) {
		console.log('[tempDraft] getDraft -> true (memory)');
		return draft.data;
	}
	if (AsyncStorage) {
		try {
			const s = await AsyncStorage.getItem(STORAGE_KEY);
			if (s) {
				draft.data = JSON.parse(s);
				console.log('[tempDraft] getDraft -> true (storage)');
				return draft.data;
			}
		} catch (e) {
			console.warn('[tempDraft] AsyncStorage read failed', e && e.message);
		}
	}
	console.log('[tempDraft] getDraft -> false');
	return null;
}

export function getDraftSync() {
	console.log('[tempDraft] getDraftSync ->', !!draft.data);
	return draft.data;
}

export async function clearDraft() {
	draft.data = null;
	console.log('[tempDraft] cleared draft (async)');
	if (AsyncStorage) {
		try {
			await AsyncStorage.removeItem(STORAGE_KEY);
		} catch (e) {
			console.warn('[tempDraft] AsyncStorage remove failed', e && e.message);
		}
	}
}

export function clearDraftSync() {
	draft.data = null;
	console.log('[tempDraft] cleared draft (sync)');
	if (AsyncStorage) {
		AsyncStorage.removeItem(STORAGE_KEY).catch((e) => console.warn('[tempDraft] AsyncStorage remove failed', e && e.message));
	}
}

export default { saveDraft, saveDraftSync, getDraft, getDraftSync, clearDraft, clearDraftSync };