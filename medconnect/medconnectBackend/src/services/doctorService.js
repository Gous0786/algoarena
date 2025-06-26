const mongoose = require('mongoose');

// Doctor Schema
const doctorSchema = new mongoose.Schema({
    name: String,
    specialty: String,
    location: String,
    fee: Number,
    qualifications: [String],
    experience: Number,
    languages: [String],
    timing: String,
    hospital: String,
    rating: Number,
    totalPatients: Number,
    isAvailable: { type: Boolean, default: true },
    createdAt: { type: Date, default: Date.now }
});

const Doctor = mongoose.models.Doctor || mongoose.model('Doctor', doctorSchema);

// Ensure mongoose is connected
async function ensureMongooseConnected() {
    if (mongoose.connection.readyState === 0) {
        await mongoose.connect(process.env.MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
    }
}

// Find doctors by specialties
async function findDoctors(specialties) {
    try {
        await ensureMongooseConnected();
        console.log('Finding doctors for specialties:', specialties);
        const regexSpecialties = specialties.map(s => new RegExp(s, 'i'));
        const doctors = await Doctor.find({
            specialty: { $in: regexSpecialties }
        });
        console.log(`Found ${doctors.length} matching doctors`);
        return doctors.map(doctor => ({
            id: doctor._id,
            name: doctor.name,
            specialty: doctor.specialty,
            location: doctor.location,
            fee: doctor.fee,
            qualifications: doctor.qualifications,
            experience: doctor.experience,
            languages: doctor.languages,
            timing: doctor.timing,
            hospital: doctor.hospital,
            rating: doctor.rating,
            totalPatients: doctor.totalPatients,
            isAvailable: doctor.isAvailable
        }));
    } catch (error) {
        console.error('Error finding doctors:', error);
        throw error;
    }
}

// Create a new doctor record
async function createDoctorRecord(doctorData) {
    await ensureMongooseConnected();
    try {
        const doctor = new Doctor({ ...doctorData });
        await doctor.save();
        return doctor;
    } catch (error) {
        console.error('Error creating doctor:', error);
        throw error;
    }
}

module.exports = { createDoctorRecord, findDoctors };