import {
  defaultVoiceSettings,
  ELEVENLABS_TIMEOUT_MS,
  getElevenLabsConfig,
} from "@/lib/assistant/speech-config";

type SpeechOptions = {
  nextText?: string;
  previousText?: string;
  signal?: AbortSignal;
  text: string;
};

export async function synthesizeSpeech({
  nextText,
  previousText,
  signal,
  text,
}: SpeechOptions) {
  const config = getElevenLabsConfig();

  if (!config.apiKey || !config.voiceId) {
    throw new Error("ElevenLabs is not configured.");
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(() => {
    controller.abort();
  }, ELEVENLABS_TIMEOUT_MS);
  const timeoutSignal = controller.signal;

  const combinedSignal = signal
    ? AbortSignal.any([signal, timeoutSignal])
    : timeoutSignal;

  try {
    const response = await fetch(
      `https://api.elevenlabs.io/v1/text-to-speech/${config.voiceId}/stream?output_format=${config.outputFormat}`,
      {
        body: JSON.stringify({
          model_id: config.modelId,
          next_text: nextText,
          previous_text: previousText,
          text,
          voice_settings: defaultVoiceSettings,
        }),
        headers: {
          "Content-Type": "application/json",
          "xi-api-key": config.apiKey,
        },
        method: "POST",
        signal: combinedSignal,
      },
    );

    return response;
  } finally {
    clearTimeout(timeoutId);
  }
}
