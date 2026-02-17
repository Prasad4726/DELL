import mongoose from 'mongoose';

const participantSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Participant name is required'],
        trim: true,
        minlength: [1, 'Name cannot be empty']
    }
}, {
    timestamps: true
});

const Participant = mongoose.model('Participant', participantSchema);

export default Participant;
