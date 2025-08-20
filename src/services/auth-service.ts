import { SignUpData, AuthResponse, SignInData } from "@/lib/typings";
import { apiRequest } from "@/lib/api";

export async function signUp(data: SignUpData): Promise<AuthResponse> {
  return await apiRequest<AuthResponse>('POST', `/sign-up`, data);
}

export async function signIn(data: SignInData) {
  return await apiRequest<AuthResponse>('POST', '/sign-in', data);
}