import { supabaseAdmin } from '@/lib/supabase';
import { HttpError } from '@/lib/http';

export type ProfileDto = {
  id: string;
  displayName: string | null;
  hskGoal: string | null;
  ttsVoice: string | null;
};

export type UpdateProfileInput = {
  displayName?: string;
  hskGoal?: string;
  ttsVoice?: string;
};

export async function getProfile(userId: string): Promise<ProfileDto> {
  const { data, error } = await supabaseAdmin
    .from('profiles')
    .select('id, display_name, hsk_goal, tts_voice')
    .eq('id', userId)
    .maybeSingle();

  if (error) {
    throw new Error(error.message);
  }

  if (!data) {
    // If not found, create a default one
    const { data: newUser, error: fetchError } = await supabaseAdmin.auth.admin.getUserById(userId);
    if (fetchError || !newUser.user) {
      throw new HttpError('User not found', 404);
    }
    
    const defaultDisplayName = newUser.user.email ? newUser.user.email.split('@')[0] : 'User';
    
    const { data: insertedData, error: insertError } = await supabaseAdmin
      .from('profiles')
      .insert({
        id: userId,
        display_name: defaultDisplayName,
        hsk_goal: 'HSK1',
        tts_voice: 'alloy',
      })
      .select('id, display_name, hsk_goal, tts_voice')
      .single();

    if (insertError) {
      throw new Error(insertError.message);
    }

    return {
      id: insertedData.id,
      displayName: insertedData.display_name,
      hskGoal: insertedData.hsk_goal,
      ttsVoice: insertedData.tts_voice,
    };
  }

  return {
    id: data.id,
    displayName: data.display_name,
    hskGoal: data.hsk_goal,
    ttsVoice: data.tts_voice,
  };
}

export async function updateProfile(userId: string, input: UpdateProfileInput): Promise<ProfileDto> {
  const updateData: any = {};
  if (input.displayName !== undefined) updateData.display_name = input.displayName;
  if (input.hskGoal !== undefined) updateData.hsk_goal = input.hskGoal;
  if (input.ttsVoice !== undefined) updateData.tts_voice = input.ttsVoice;
  
  updateData.updated_at = new Date().toISOString();

  const { data, error } = await supabaseAdmin
    .from('profiles')
    .update(updateData)
    .eq('id', userId)
    .select('id, display_name, hsk_goal, tts_voice')
    .maybeSingle();

  if (error) {
    throw new Error(error.message);
  }

  if (!data) {
    throw new HttpError('Profile not found', 404);
  }

  return {
    id: data.id,
    displayName: data.display_name,
    hskGoal: data.hsk_goal,
    ttsVoice: data.tts_voice,
  };
}
