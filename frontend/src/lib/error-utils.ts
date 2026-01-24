
import { AxiosError } from 'axios';

export const getErrorMessage = (error: unknown): string => {
    if (error instanceof AxiosError && error.response?.data) {
        const data = error.response.data;
        if (data.error && typeof data.error === 'string') {
            return data.error;
        }
        if (data.message && typeof data.message === 'string') {
            return data.message;
        }
        if (typeof data === 'object') {
            const messages: string[] = [];
            Object.entries(data).forEach(([key, value]) => {
                if (Array.isArray(value)) {
                    const fieldName = key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
                    if (key === 'non_field_errors') {
                        messages.push(value.join(', '));
                    } else {
                        messages.push(`${fieldName}: ${value.join(', ')}`);
                    }
                } else if (typeof value === 'string') {
                    messages.push(value);
                }
            });

            if (messages.length > 0) {
                return messages.join('\n');
            }
        }
    }

    if (error instanceof Error) {
        return error.message;
    }

    return 'An unexpected error occurred';
};
