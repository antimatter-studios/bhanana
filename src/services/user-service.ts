import { supabaseAdmin } from "@/lib/supabase-admin";

export type UserRow = {
  id: string;
  username: string;
  display_name: string;
  role: string;
  avatar_url?: string | null;
  password_hash?: string;
  created_at: string;
  updated_at: string;
};

export type UserCreateInput = {
  username: string;
  display_name: string;
  role: string;
  password_hash: string;
};

export type UserUpdateInput = Partial<{
  display_name: string;
  role: string;
  avatar_url: string | null;
  password_hash: string;
}>;

export class UserService {
  private static client = supabaseAdmin();

  static async list(): Promise<UserRow[]> {
    const { data, error } = await this.client
      .from("users")
      .select("id, username, display_name, role, avatar_url, created_at, updated_at")
      .order("created_at", { ascending: true });
    if (error) throw error;
    return data ?? [];
  }

  static async get(id: string): Promise<UserRow | null> {
    const { data, error } = await this.client
      .from("users")
      .select("id, username, display_name, role, avatar_url, created_at, updated_at")
      .eq("id", id)
      .single();
    if (error) throw error;
    return data ?? null;
  }

  static async getByUsername(username: string): Promise<UserRow | null> {
    const { data, error } = await this.client
      .from("users")
      .select("id, username, display_name, role, avatar_url, created_at, updated_at")
      .eq("username", username)
      .single();
    if (error) throw error;
    return data ?? null;
  }

  static async create(input: UserCreateInput) {
    const { error } = await this.client.from("users").insert({
      username: input.username,
      display_name: input.display_name,
      role: input.role,
      password_hash: input.password_hash,
    });
    if (error) throw error;
  }

  static async update(id: string, input: UserUpdateInput) {
    const updates: Record<string, string | null> = {};
    if (input.display_name !== undefined) updates.display_name = input.display_name;
    if (input.role !== undefined) updates.role = input.role;
    if (input.password_hash !== undefined) updates.password_hash = input.password_hash;
    if (input.avatar_url !== undefined) updates.avatar_url = input.avatar_url;

    const { error } = await this.client.from("users").update(updates).eq("id", id);
    if (error) throw error;
  }
}
