import { model, models, Schema, Types, type HydratedDocument } from "mongoose";

export const REPORT_REASONS = ["spam", "harassment", "hate-speech", "misinformation", "other"] as const;
export const REPORT_STATUSES = ["pending", "reviewed", "resolved"] as const;

export type ReportReason = (typeof REPORT_REASONS)[number];
export type ReportStatus = (typeof REPORT_STATUSES)[number];

export interface ReportAttributes {
  reporterId: Types.ObjectId;
  targetType: "post" | "comment";
  targetId: Types.ObjectId;
  reason: ReportReason;
  details?: string;
  status: ReportStatus;
  flaggedForReview: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

const reportSchema = new Schema<ReportAttributes>(
  {
    reporterId: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    targetType: { type: String, enum: ["post", "comment"], required: true, index: true },
    targetId: { type: Schema.Types.ObjectId, required: true, index: true },
    reason: { type: String, enum: REPORT_REASONS, required: true, index: true },
    details: { type: String, default: "", maxlength: 500, trim: true },
    status: { type: String, enum: REPORT_STATUSES, default: "pending", index: true },
    flaggedForReview: { type: Boolean, default: false, index: true },
  },
  { timestamps: true, minimize: false },
);

reportSchema.index({ reporterId: 1, targetType: 1, targetId: 1 }, { unique: true });

export type ReportDocument = HydratedDocument<ReportAttributes>;

const ReportModel = models.Report || model<ReportAttributes>("Report", reportSchema);

export default ReportModel;
