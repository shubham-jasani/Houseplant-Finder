export type Attribute =
  | "light" |"careTime" |"watering" |"dryAirTolerance" |"size" |"petSafety" |"growthRate" |"form";

/**
 * Narrow, correct value types for each attribute.
 * Used for UI, care info lookups, and guides.
 * Does NOT break scoring logic.
 */
export type AttributeValueMap = {
  light: "low" | "medium" | "bright";
  careTime: "very-low" | "low" | "medium";
  watering: "low" | "medium" | "high";
  dryAirTolerance: "low" | "medium" | "high";
  size: "small" | "medium" | "large";
  petSafety: "safe" | "toxic";
  growthRate: "slow" | "medium" | "fast";
  form: "upright" | "trailing" | "bushy";
};

export type Plant = {
  name: string;
  slug: string;

  /**
   * IMPORTANT:
   * - Record<Attribute, string> keeps all existing code working
   * - AttributeValueMap gives TypeScript exact unions where needed
   * - This is a SAFE refinement, not a breaking change
   */
  attributes: Record<Attribute, string> & AttributeValueMap;
};

export type Question = {
  id: string;
  attribute: Attribute;
  weight: number;
};

export type ScoreResult = {
  plant: Plant;
  score: number;
  breakdown: Partial<Record<Attribute, number>>;
};
