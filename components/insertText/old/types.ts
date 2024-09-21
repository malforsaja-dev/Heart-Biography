export type ModalType = "rotate" | "styleBox" | "styleText" | null;

export interface TextObject {
  id: number;
  text: string;
  originalText: string;
  isEditing: boolean;
  isDropdownOpen: boolean;
  isHelpModalOpen: boolean;
  helpModalType: ModalType;
  width: number;
  height: number;
  x: number;
  y: number;
  rotation: number;
  backgroundColor: string;
  borderColor: string;
  borderSize: number; // New addition for border size
  fontSize: number;
  isBold: boolean;
  isItalic: boolean;
  textColor: string;
}
