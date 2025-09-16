import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  Save, 
  Calendar, 
  TrendingUp, 
  Heart, 
  Scale, 
  Activity,
  Moon,
  Zap,
  AlertCircle,
  Edit,
  Trash2
} from 'lucide-react';
import { storage } from '../utils/storage';
import { HealthMetric } from '../types';
import { formatDate, calculateBMI, getBMICategory } from '../utils/calculations';

const HealthMetrics: React.FC = () => {
  const [metrics, setMetrics] = useState<HealthMetric[]>([]);
  const [isAddingMetric, setIsAddingMetric] = useState(false);
  const [editingMetric, setEditingMetric] = useState<HealthMetric | null>(null);

  useEffect(() => {
    setMetrics(storage.getHealthMetrics());
  }, []);

  const saveMetric = (metric: HealthMetric) => {
    let updatedMetrics;
    if (editingMetric) {
      updatedMetrics = metrics.map(m => m.id === metric.id ? metric : m);
    } else {
      updatedMetrics = [...metrics, metric];
    }
    
    // Sort by date (newest first)
    updatedMetrics.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    
    setMetrics(updatedMetrics);
    storage.setHealthMetrics(updatedMetrics);
    setIsAddingMetric(false);
    setEditingMetric(null);
  };

  const deleteMetric = (id: string) => {
    const updatedMetrics = metrics.filter(m => m.id !== id);
    setMetrics(updatedMetrics);
    storage.setHealthMetrics(updatedMetrics);
  };

  // Get latest metrics for overview
  const latestMetrics = metrics[0];
  const user = storage.getUser();

  if (isAddingMetric || editingMetric) {
    return (
      <MetricForm
        metric={editingMetric}
        onSave={saveMetric}
        onCancel={() => {
          setIsAddingMetric(false);
          setEditingMetric(null);
        }}
      />
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Health Metrics</h1>
          <p className="text-gray-600 mt-2">Track your vital health indicators over time</p>
        </div>
        <button
          onClick={() => setIsAddingMetric(true)}
          className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-lg flex items-center space-x-2 transition-colors duration-200"
        >
          <Plus className="w-5 h-5" />
          <span>Record Metrics</span>
        </button>
      </div>

      {/* Current Overview */}
      {latestMetrics && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {latestMetrics.weight && (
            <MetricCard
              icon={Scale}
              title="Weight"
              value={`${latestMetrics.weight} kg`}
              subtitle={user ? `BMI: ${calculateBMI(latestMetrics.weight, user.height).toFixed(1)}` : ''}
              color="bg-blue-500"
              date={latestMetrics.date}
            />
          )}
          {latestMetrics.bloodPressure && (
            <MetricCard
              icon={Heart}
              title="Blood Pressure"
              value={`${latestMetrics.bloodPressure.systolic}/${latestMetrics.bloodPressure.diastolic}`}
              subtitle="mmHg"
              color="bg-red-500"
              date={latestMetrics.date}
            />
          )}
          {latestMetrics.restingHeartRate && (
            <MetricCard
              icon={Activity}
              title="Resting HR"
              value={`${latestMetrics.restingHeartRate}`}
              subtitle="bpm"
              color="bg-pink-500"
              date={latestMetrics.date}
            />
          )}
          {latestMetrics.sleepHours && (
            <MetricCard
              icon={Moon}
              title="Sleep"
              value={`${latestMetrics.sleepHours} hrs`}
              subtitle="last night"
              color="bg-indigo-500"
              date={latestMetrics.date}
            />
          )}
        </div>
      )}

      {/* Health Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Health Insights</h3>
          <div className="space-y-4">
            {latestMetrics?.weight && user && (
              <InsightCard
                icon={Scale}
                title="BMI Status"
                value={getBMICategory(calculateBMI(latestMetrics.weight, user.height))}
                description={`Your BMI is ${calculateBMI(latestMetrics.weight, user.height).toFixed(1)}`}
                type={getBMICategory(calculateBMI(latestMetrics.weight, user.height)) === 'Normal weight' ? 'success' : 'warning'}
              />
            )}
            {latestMetrics?.bloodPressure && (
              <InsightCard
                icon={Heart}
                title="Blood Pressure"
                value={getBloodPressureCategory(latestMetrics.bloodPressure.systolic, latestMetrics.bloodPressure.diastolic)}
                description={`${latestMetrics.bloodPressure.systolic}/${latestMetrics.bloodPressure.diastolic} mmHg`}
                type={getBloodPressureCategory(latestMetrics.bloodPressure.systolic, latestMetrics.bloodPressure.diastolic) === 'Normal' ? 'success' : 'warning'}
              />
            )}
            {latestMetrics?.sleepHours && (
              <InsightCard
                icon={Moon}
                title="Sleep Quality"
                value={getSleepQuality(latestMetrics.sleepHours)}
                description={`${latestMetrics.sleepHours} hours of sleep`}
                type={latestMetrics.sleepHours >= 7 && latestMetrics.sleepHours <= 9 ? 'success' : 'warning'}
              />
            )}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Health Tips</h3>
          <div className="space-y-3">
            <div className="p-4 bg-green-50 rounded-lg">
              <h4 className="font-medium text-green-800 mb-1">Regular Monitoring</h4>
              <p className="text-sm text-green-700">
                Track your metrics weekly to identify trends and make informed health decisions.
              </p>
            </div>
            <div className="p-4 bg-blue-50 rounded-lg">
              <h4 className="font-medium text-blue-800 mb-1">Blood Pressure</h4>
              <p className="text-sm text-blue-700">
                Normal BP is less than 120/80 mmHg. Consider lifestyle changes if consistently elevated.
              </p>
            </div>
            <div className="p-4 bg-purple-50 rounded-lg">
              <h4 className="font-medium text-purple-800 mb-1">Sleep Quality</h4>
              <p className="text-sm text-purple-700">
                Aim for 7-9 hours of quality sleep each night for optimal health and recovery.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Metrics History */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Metrics History</h3>
        
        {metrics.length === 0 ? (
          <div className="text-center py-12">
            <Heart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No health metrics recorded</h3>
            <p className="text-gray-500 mb-6">Start tracking your health metrics to monitor your progress</p>
            <button
              onClick={() => setIsAddingMetric(true)}
              className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-lg transition-colors duration-200"
            >
              Record Your First Metrics
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {metrics.map((metric) => (
              <MetricHistoryCard
                key={metric.id}
                metric={metric}
                onEdit={setEditingMetric}
                onDelete={deleteMetric}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

const MetricCard: React.FC<{
  icon: React.ComponentType<any>;
  title: string;
  value: string;
  subtitle?: string;
  color: string;
  date: string;
}> = ({ icon: Icon, title, value, subtitle, color, date }) => (
  <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
    <div className="flex items-center justify-between mb-4">
      <div>
        <p className="text-sm font-medium text-gray-600">{title}</p>
        <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
        {subtitle && <p className="text-sm text-gray-500 mt-1">{subtitle}</p>}
      </div>
      <div className={`p-3 rounded-lg ${color}`}>
        <Icon className="w-6 h-6 text-white" />
      </div>
    </div>
    <p className="text-xs text-gray-400">Last updated: {new Date(date).toLocaleDateString()}</p>
  </div>
);

const InsightCard: React.FC<{
  icon: React.ComponentType<any>;
  title: string;
  value: string;
  description: string;
  type: 'success' | 'warning' | 'danger';
}> = ({ icon: Icon, title, value, description, type }) => {
  const colors = {
    success: 'bg-green-50 text-green-800 border-green-200',
    warning: 'bg-yellow-50 text-yellow-800 border-yellow-200',
    danger: 'bg-red-50 text-red-800 border-red-200'
  };

  return (
    <div className={`p-4 rounded-lg border ${colors[type]}`}>
      <div className="flex items-start space-x-3">
        <Icon className="w-5 h-5 mt-0.5" />
        <div>
          <h4 className="font-medium mb-1">{title}</h4>
          <p className="font-semibold">{value}</p>
          <p className="text-sm opacity-75 mt-1">{description}</p>
        </div>
      </div>
    </div>
  );
};

const MetricHistoryCard: React.FC<{
  metric: HealthMetric;
  onEdit: (metric: HealthMetric) => void;
  onDelete: (id: string) => void;
}> = ({ metric, onEdit, onDelete }) => (
  <div className="border border-gray-200 rounded-lg p-4">
    <div className="flex items-start justify-between mb-3">
      <div className="flex items-center space-x-2">
        <Calendar className="w-4 h-4 text-gray-400" />
        <span className="font-medium text-gray-900">
          {new Date(metric.date).toLocaleDateString()}
        </span>
      </div>
      <div className="flex items-center space-x-2">
        <button
          onClick={() => onEdit(metric)}
          className="p-1 text-gray-400 hover:text-emerald-600 transition-colors duration-200"
        >
          <Edit className="w-4 h-4" />
        </button>
        <button
          onClick={() => onDelete(metric.id)}
          className="p-1 text-gray-400 hover:text-red-600 transition-colors duration-200"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>

    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
      {metric.weight && (
        <div className="text-center p-2 bg-gray-50 rounded">
          <Scale className="w-4 h-4 text-gray-600 mx-auto mb-1" />
          <p className="text-sm font-medium">{metric.weight} kg</p>
          <p className="text-xs text-gray-500">Weight</p>
        </div>
      )}
      {metric.bloodPressure && (
        <div className="text-center p-2 bg-gray-50 rounded">
          <Heart className="w-4 h-4 text-gray-600 mx-auto mb-1" />
          <p className="text-sm font-medium">
            {metric.bloodPressure.systolic}/{metric.bloodPressure.diastolic}
          </p>
          <p className="text-xs text-gray-500">BP</p>
        </div>
      )}
      {metric.restingHeartRate && (
        <div className="text-center p-2 bg-gray-50 rounded">
          <Activity className="w-4 h-4 text-gray-600 mx-auto mb-1" />
          <p className="text-sm font-medium">{metric.restingHeartRate} bpm</p>
          <p className="text-xs text-gray-500">Resting HR</p>
        </div>
      )}
      {metric.sleepHours && (
        <div className="text-center p-2 bg-gray-50 rounded">
          <Moon className="w-4 h-4 text-gray-600 mx-auto mb-1" />
          <p className="text-sm font-medium">{metric.sleepHours} hrs</p>
          <p className="text-xs text-gray-500">Sleep</p>
        </div>
      )}
      {metric.stressLevel && (
        <div className="text-center p-2 bg-gray-50 rounded">
          <AlertCircle className="w-4 h-4 text-gray-600 mx-auto mb-1" />
          <p className="text-sm font-medium">{metric.stressLevel}/10</p>
          <p className="text-xs text-gray-500">Stress</p>
        </div>
      )}
      {metric.energy && (
        <div className="text-center p-2 bg-gray-50 rounded">
          <Zap className="w-4 h-4 text-gray-600 mx-auto mb-1" />
          <p className="text-sm font-medium">{metric.energy}/10</p>
          <p className="text-xs text-gray-500">Energy</p>
        </div>
      )}
    </div>

    {metric.notes && (
      <div className="mt-3 p-3 bg-blue-50 rounded-lg">
        <p className="text-sm text-blue-800">{metric.notes}</p>
      </div>
    )}
  </div>
);

const MetricForm: React.FC<{
  metric?: HealthMetric | null;
  onSave: (metric: HealthMetric) => void;
  onCancel: () => void;
}> = ({ metric, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    date: metric?.date || formatDate(new Date()),
    weight: metric?.weight || '',
    bodyFat: metric?.bodyFat || '',
    muscleMass: metric?.muscleMass || '',
    systolic: metric?.bloodPressure?.systolic || '',
    diastolic: metric?.bloodPressure?.diastolic || '',
    restingHeartRate: metric?.restingHeartRate || '',
    sleepHours: metric?.sleepHours || '',
    stressLevel: metric?.stressLevel || '',
    energy: metric?.energy || '',
    notes: metric?.notes || ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const metricData: HealthMetric = {
      id: metric?.id || Date.now().toString(),
      date: formData.date,
      ...(formData.weight && { weight: Number(formData.weight) }),
      ...(formData.bodyFat && { bodyFat: Number(formData.bodyFat) }),
      ...(formData.muscleMass && { muscleMass: Number(formData.muscleMass) }),
      ...(formData.systolic && formData.diastolic && {
        bloodPressure: {
          systolic: Number(formData.systolic),
          diastolic: Number(formData.diastolic)
        }
      }),
      ...(formData.restingHeartRate && { restingHeartRate: Number(formData.restingHeartRate) }),
      ...(formData.sleepHours && { sleepHours: Number(formData.sleepHours) }),
      ...(formData.stressLevel && { stressLevel: Number(formData.stressLevel) }),
      ...(formData.energy && { energy: Number(formData.energy) }),
      ...(formData.notes && { notes: formData.notes })
    };
    
    onSave(metricData);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">
            {metric ? 'Edit Health Metrics' : 'Record Health Metrics'}
          </h2>
          <button
            onClick={onCancel}
            className="text-gray-400 hover:text-gray-600"
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Date
            </label>
            <input
              type="date"
              required
              value={formData.date}
              onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Weight (kg)
              </label>
              <input
                type="number"
                step="0.1"
                min="0"
                value={formData.weight}
                onChange={(e) => setFormData(prev => ({ ...prev, weight: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Body Fat (%)
              </label>
              <input
                type="number"
                step="0.1"
                min="0"
                max="100"
                value={formData.bodyFat}
                onChange={(e) => setFormData(prev => ({ ...prev, bodyFat: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Muscle Mass (kg)
              </label>
              <input
                type="number"
                step="0.1"
                min="0"
                value={formData.muscleMass}
                onChange={(e) => setFormData(prev => ({ ...prev, muscleMass: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Systolic BP (mmHg)
              </label>
              <input
                type="number"
                min="0"
                value={formData.systolic}
                onChange={(e) => setFormData(prev => ({ ...prev, systolic: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Diastolic BP (mmHg)
              </label>
              <input
                type="number"
                min="0"
                value={formData.diastolic}
                onChange={(e) => setFormData(prev => ({ ...prev, diastolic: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Resting Heart Rate (bpm)
              </label>
              <input
                type="number"
                min="0"
                value={formData.restingHeartRate}
                onChange={(e) => setFormData(prev => ({ ...prev, restingHeartRate: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Sleep Hours
              </label>
              <input
                type="number"
                step="0.5"
                min="0"
                max="24"
                value={formData.sleepHours}
                onChange={(e) => setFormData(prev => ({ ...prev, sleepHours: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Stress Level (1-10)
              </label>
              <input
                type="number"
                min="1"
                max="10"
                value={formData.stressLevel}
                onChange={(e) => setFormData(prev => ({ ...prev, stressLevel: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Energy Level (1-10)
              </label>
              <input
                type="number"
                min="1"
                max="10"
                value={formData.energy}
                onChange={(e) => setFormData(prev => ({ ...prev, energy: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Notes (optional)
            </label>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              placeholder="Any additional notes about your health today..."
            />
          </div>

          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={onCancel}
              className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors duration-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-colors duration-200 flex items-center space-x-2"
            >
              <Save className="w-4 h-4" />
              <span>Save Metrics</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Helper functions
const getBloodPressureCategory = (systolic: number, diastolic: number): string => {
  if (systolic < 120 && diastolic < 80) return 'Normal';
  if (systolic < 130 && diastolic < 80) return 'Elevated';
  if (systolic < 140 || diastolic < 90) return 'High Stage 1';
  if (systolic < 180 || diastolic < 120) return 'High Stage 2';
  return 'Hypertensive Crisis';
};

const getSleepQuality = (hours: number): string => {
  if (hours < 6) return 'Insufficient';
  if (hours >= 7 && hours <= 9) return 'Optimal';
  if (hours > 9) return 'Excessive';
  return 'Adequate';
};

export default HealthMetrics;