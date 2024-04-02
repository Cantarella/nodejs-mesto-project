import { model, Schema } from 'mongoose';

interface iCard {
  name: string
  link: string
  owner: Schema.Types.ObjectId
  likes: Schema.Types.ObjectId[]
  createdAt: Schema.Types.Date
}
const cardSchema = new Schema<iCard>({
  name: {
    type: String,
    minlength: 2,
    maxlength: 30,
    required: true,
  },
  link: {
    type: String,
    required: true,
    validate: {
      validator(v: string) {
        return /^(https?:\/\/)?([\w-]{1,32}\.[\w-]{1,32})[^\s@]*$/.test(v);
      },
      message: (props) => `${props.value} передана некорректная ссылка`,
    },
  },
  owner: {
    type: Schema.Types.ObjectId,
    ref: 'user',
    required: true,
  },
  likes: [{
    type: Schema.Types.ObjectId,
    ref: 'user',
    default: [],
  }],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});
export default model('card', cardSchema);
