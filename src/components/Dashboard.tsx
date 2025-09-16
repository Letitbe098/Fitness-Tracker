import React, { useState, useEffect } from 'react';
import { 
  TrendingUp, 
  Flame, 
  Target, 
  Calendar,
  Dumbbell,
  Apple,
  Heart,
  Trophy,
  Plus
} from 'lucide-react';
import { storage } from '../utils/storage';
import { calculateBMI, getBMICategory, formatDate } from '../utils/calculations';

interface DashboardProps {
  onTabChange: (tab: string) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ onTabChange }) => {
  const [stats, setStats] = useState({
    totalWorkouts: 0,
    weeklyWorkouts: 0,
    totalCalories: 0,
    weeklyCalories: 0,
    currentWeight: 0,
    bmi: 0,
    bmiCategory: '',
    completedGoals: 0,
    totalGoals: 0
  });

  useEffect(() => {
    const user = storage.getUser();
    const workouts = storage.getWorkouts();
    const nutrition = storage.getNutrition();
    const healthMetrics = storage.getHealthMetrics();
    const goals = storage.getGoals();

    // Calculate workout stats
    const today = new Date();
    const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
    const weeklyWorkouts = workouts.filter((w: any) => new Date(w.date) >= weekAgo);

    // Calculate nutrition stats
    const weeklyNutrition = nutrition.filter((n: any) => new Date(n.date) >= weekAgo);
    const weeklyCalories = weeklyNutrition.reduce((sum: number, n: any) => sum + n.totalCalories, 0);

    // Get latest health metrics
    const latestMetrics = healthMetrics.length > 0 
      ? healthMetrics[healthMetrics.length - 1] 
      : null;

    const currentWeight = latestMetrics?.weight || user?.currentWeight || 0;
    const bmi = user && currentWeight ? calculateBMI(currentWeight, user.height) : 0;

    // Calculate goal completion
    const completedGoals = goals.filter((g: any) => g.completed).length;

    setStats({
      totalWorkouts: workouts.length,
      weeklyWorkouts: weeklyWorkouts.length,
      totalCalories: nutrition.reduce((sum: number, n: any) => sum + n.totalCalories, 0),
      weeklyCalories,
      currentWeight,
      bmi,
      bmiCategory: bmi ? getBMICategory(bmi) : '',
      completedGoals,
      totalGoals: goals.length
    });
  }, []);

  const StatCard = ({ icon: Icon, title, value, subtitle, color, onClick }: any) => (
    <div 
      className={`bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-all duration-200 ${onClick ? 'cursor-pointer' : ''}`}
      onClick={onClick}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
          {subtitle && <p className="text-sm text-gray-500 mt-1">{subtitle}</p>}
        </div>
        <div className={`p-3 rounded-lg ${color}`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
      </div>
    </div>
  );

  const QuickAction = ({ icon: Icon, title, description, onClick, color }: any) => (
    <button
      onClick={onClick}
      className="w-full bg-white rounded-xl shadow-sm border border-gray-100 p-4 hover:shadow-md transition-all duration-200 text-left"
    >
      <div className="flex items-center space-x-3">
        <div className={`p-2 rounded-lg ${color}`}>
          <Icon className="w-5 h-5 text-white" />
        </div>
        <div>
          <h3 className="font-medium text-gray-900">{title}</h3>
          <p className="text-sm text-gray-500">{description}</p>
        </div>
      </div>
    </button>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Welcome back!</h1>
        <p className="text-gray-600 mt-2">Here's your fitness overview for today</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          icon={Dumbbell}
          title="Workouts This Week"
          value={stats.weeklyWorkouts}
          subtitle={`${stats.totalWorkouts} total`}
          color="bg-emerald-500"
          onClick={() => onTabChange('workouts')}
        />
        <StatCard
          icon={Flame}
          title="Calories This Week"
          value={stats.weeklyCalories.toLocaleString()}
          subtitle={`${stats.totalCalories.toLocaleString()} total`}
          color="bg-orange-500"
          onClick={() => onTabChange('nutrition')}
        />
        <StatCard
          icon={Heart}
          title="Current Weight"
          value={stats.currentWeight ? `${stats.currentWeight}kg` : 'N/A'}
          subtitle={stats.bmiCategory ? `BMI: ${stats.bmi.toFixed(1)} (${stats.bmiCategory})` : ''}
          color="bg-red-500"
          onClick={() => onTabChange('health')}
        />
        <StatCard
          icon={Trophy}
          title="Goals Completed"
          value={`${stats.completedGoals}/${stats.totalGoals}`}
          subtitle={stats.totalGoals > 0 ? `${Math.round((stats.completedGoals / stats.totalGoals) * 100)}% complete` : 'No goals set'}
          color="bg-blue-500"
          onClick={() => onTabChange('goals')}
        />
      </div>

      {/* Quick Actions */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <QuickAction
            icon={Plus}
            title="Log Workout"
            description="Record your latest training session"
            onClick={() => onTabChange('workouts')}
            color="bg-emerald-500"
          />
          <QuickAction
            icon={Apple}
            title="Track Nutrition"
            description="Log your meals and calories"
            onClick={() => onTabChange('nutrition')}
            color="bg-orange-500"
          />
          <QuickAction
            icon={Heart}
            title="Record Health Metrics"
            description="Update weight, BP, and more"
            onClick={() => onTabChange('health')}
            color="bg-red-500"
          />
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-900">Recent Activity</h2>
          <button 
            onClick={() => onTabChange('progress')}
            className="text-emerald-600 hover:text-emerald-700 font-medium text-sm"
          >
            View All
          </button>
        </div>
        
        <div className="space-y-4">
          {/* Sample recent activities */}
          <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
            <div className="p-2 bg-emerald-100 rounded-lg">
              <Dumbbell className="w-4 h-4 text-emerald-600" />
            </div>
            <div className="flex-1">
              <p className="font-medium text-gray-900">Completed Upper Body Workout</p>
              <p className="text-sm text-gray-500">45 minutes • 2 hours ago</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
            <div className="p-2 bg-orange-100 rounded-lg">
              <Apple className="w-4 h-4 text-orange-600" />
            </div>
            <div className="flex-1">
              <p className="font-medium text-gray-900">Logged breakfast - 450 calories</p>
              <p className="text-sm text-gray-500">This morning</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Target className="w-4 h-4 text-blue-600" />
            </div>
            <div className="flex-1">
              <p className="font-medium text-gray-900">Goal achieved: 10,000 steps</p>
              <p className="text-sm text-gray-500">Yesterday</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;