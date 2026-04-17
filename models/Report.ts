import { model, models, Schema, type InferSchemaType } from "mongoose";

const reportSchema = new Schema(
  {
    post: { type: Schema.Types.ObjectId, ref: "Post", required: true, index: true },
    user: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    reason: { type: String, required: true },
    status: { type: String, enum: ["open", "reviewed"], default: "open" },
  },
  { timestamps: true },
);

export type ReportDocument = InferSchemaType<typeof reportSchema>;

const ReportModel = models.Report || model("Report", reportSchema);

export default ReportModel;
