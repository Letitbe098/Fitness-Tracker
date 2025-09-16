import mongoose from 'mongoose';

const workoutSetSchema = new mongoose.Schema({
  reps: { type: Number, required: true },
  weight: { type: Number, default: 0 },
  duration: { type: Number, default: 0 },
  distance: { type: Number, default: 0 }
});

const workoutExerciseSchema = new mongoose.Schema({
  exerciseId: { type: String, required: true },
  exerciseName: { type: String, required: true },
  sets: [workoutSetSchema],
  notes: { type: String, default: '' }
});

const workoutSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  exercises: [workoutExerciseSchema],
  duration: {
    type: Number,
    required: true // in minutes
  },
  caloriesBurned: {
    type: Number,
    default: 0
  },
  notes: {
    type: String,
    default: ''
  }
}, {
  timestamps: true
});

export default mongoose.model('Workout', workoutSchema);