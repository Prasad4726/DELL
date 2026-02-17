import mongoose from 'mongoose';

const formSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
        trim: true,
    },
    description: {
        type: String,
        default: '',
        trim: true,
    },
    fields: [{
        fieldName: {
            type: String,
            required: true,
        },
        label: {
            type: String,
            required: true,
        },
        type: {
            type: String,
            enum: ['text', 'number', 'email', 'phone', 'select', 'radio', 'checkbox', 'textarea'],
            required: true,
        },
        required: {
            type: Boolean,
            default: false,
        },
        options: [{
            type: String,
        }],
        placeholder: {
            type: String,
            default: '',
        },
    }],
    isActive: {
        type: Boolean,
        default: true,
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Agent',
        required: true,
    },
    submissionCount: {
        type: Number,
        default: 0,
    },
}, {
    timestamps: true,
});

// Index for faster lookups
formSchema.index({ name: 1 });
formSchema.index({ isActive: 1 });

const Form = mongoose.model('Form', formSchema);

export default Form;
