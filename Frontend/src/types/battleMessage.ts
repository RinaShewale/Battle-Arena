export type SelectedFile = {
  name: string;
  content: string;
};

export type SelectedImage = {
  name: string;
  dataUrl: string;
  previewUrl: string;
};

export type ToolPopup = "file" | "image" | "web" | "mic" | null;

export type BattleMessagePayload = {
  message: string;
  fileName?: string;
  fileContent?: string;
  imageName?: string;
  imageDataUrl?: string;
  webSearchResult?: string;
};
