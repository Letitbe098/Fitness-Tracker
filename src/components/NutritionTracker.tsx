import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  Save, 
  Search, 
  Calendar,
  PieChart,
  Droplets,
  Target,
  TrendingUp
} from 'lucide-react';
import { storage } from '../utils/storage';
import { foods } from '../data/foods';
import { NutritionLog, FoodEntry } from '../types';
import { formatDate } from '../utils/calculations';

const NutritionTracker: React.FC = () => {
  const [nutritionLogs, setNutritionLogs] = useState<NutritionLog[]>([]);
  const [selectedDate, setSelectedDate] = useState(formatDate(new Date()));
  const [currentLog, setCurrentLog] = useState<NutritionLog | null>(null);
  const [activemeal, setActivemeal] = useState<'breakfast' | 'lunch' | 'dinner' | 'snacks'>('breakfast');
  const [isAddingFood, setIsAddingFood] = useState(false);

  useEffect(() => {
    const logs = storage.getNutrition();
    setNutritionLogs(logs);
    
    // Find or create log for selected date
    const existingLog = logs.find((log: NutritionLog) => log.date === selectedDate);
    if (existingLog) {
      setCurrentLog(existingLog);
    } else {
      const newLog: NutritionLog = {
        id: Date.now().toString(),
        date: selectedDate,
        meals: {
          breakfast: [],
          lunch: [],
          dinner: [],
          snacks: []
        },
        water: 0,
        totalCalories: 0,
        totalProtein: 0,
        totalCarbs: 0,
        totalFat: 0
      };
      setCurrentLog(newLog);
    }
  }, [selectedDate]);

  const calculateTotals = (log: NutritionLog): NutritionLog => {
    const allFoods = [
      ...log.meals.breakfast,
      ...log.meals.lunch,
      ...log.meals.dinner,
      ...log.meals.snacks
    ];

    return {
      ...log,
      totalCalories: allFoods.reduce((sum, food) => sum + food.calories, 0),
      totalProtein: allFoods.reduce((sum, food) => sum + food.protein, 0),
      totalCarbs: allFoods.reduce((sum, food) => sum + food.carbs, 0),
      totalFat: allFoods.reduce((sum, food) => sum + food.fat, 0)
    };
  };

  const saveNutritionLog = (log: NutritionLog) => {
    const calculatedLog = calculateTotals(log);
    const existingIndex = nutritionLogs.findIndex(l => l.date === log.date);
    
    let updatedLogs;
    if (existingIndex >= 0) {
      updatedLogs = nutritionLogs.map((l, i) => i === existingIndex ? calculatedLog : l);
    } else {
      updatedLogs = [...nutritionLogs, calculatedLog];
    }
    
    setNutritionLogs(updatedLogs);
    storage.setNutrition(updatedLogs);
    setCurrentLog(calculatedLog);
  };

  const addFoodToMeal = (food: FoodEntry) => {
    if (!currentLog) return;
    
    const updatedLog = {
      ...currentLog,
      meals: {
        ...currentLog.meals,
        [activemeal]: [...currentLog.meals[activemeal], food]
      }
    };
    
    saveNutritionLog(updatedLog);
    setIsAddingFood(false);
  };

  const removeFoodFromMeal = (mealType: keyof NutritionLog['meals'], foodIndex: number) => {
    if (!currentLog) return;
    
    const updatedLog = {
      ...currentLog,
      meals: {
        ...currentLog.meals,
        [mealType]: currentLog.meals[mealType].filter((_, i) => i !== foodIndex)
      }
    };
    
    saveNutritionLog(updatedLog);
  };

  const updateWater = (amount: number) => {
    if (!currentLog) return;
    
    const updatedLog = {
      ...currentLog,
      water: Math.max(0, currentLog.water + amount)
    };
    
    saveNutritionLog(updatedLog);
  };

  // Calculate daily targets (example values)
  const dailyTargets = {
    calories: 2000,
    protein: 150,
    carbs: 250,
    fat: 65,
    water: 2000 // ml
  };

  if (isAddingFood) {
    return (
      <FoodSelector
        onSelect={addFoodToMeal}
        onCancel={() => setIsAddingFood(false)}
        mealType={activemeal}
      />
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Nutrition Tracker</h1>
          <p className="text-gray-600 mt-2">Monitor your daily nutrition and caloric intake</p>
        </div>
        <div className="flex items-center space-x-4">
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
          />
        </div>
      </div>

      {currentLog && (
        <>
          {/* Daily Summary */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
            <MacroCard
              title="Calories"
              current={currentLog.totalCalories}
              target={dailyTargets.calories}
              unit="kcal"
              color="bg-orange-500"
            />
            <MacroCard
              title="Protein"
              current={currentLog.totalProtein}
              target={dailyTargets.protein}
              unit="g"
              color="bg-red-500"
            />
            <MacroCard
              title="Carbs"
              current={currentLog.totalCarbs}
              target={dailyTargets.carbs}
              unit="g"
              color="bg-blue-500"
            />
            <MacroCard
              title="Fat"
              current={currentLog.totalFat}
              target={dailyTargets.fat}
              unit="g"
              color="bg-yellow-500"
            />
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-sm font-medium text-gray-600">Water</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {currentLog.water}ml
                  </p>
                </div>
                <div className="p-3 rounded-lg bg-cyan-500">
                  <Droplets className="w-6 h-6 text-white" />
                </div>
              </div>
              <div className="flex justify-between space-x-2">
                <button
                  onClick={() => updateWater(-250)}
                  className="flex-1 py-2 text-sm bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors duration-200"
                >
                  -250ml
                </button>
                <button
                  onClick={() => updateWater(250)}
                  className="flex-1 py-2 text-sm bg-cyan-100 hover:bg-cyan-200 text-cyan-700 rounded-lg transition-colors duration-200"
                >
                  +250ml
                </button>
              </div>
            </div>
          </div>

          {/* Meal Tabs */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 mb-8">
            <div className="border-b border-gray-200">
              <nav className="flex space-x-8 px-6">
                {(['breakfast', 'lunch', 'dinner', 'snacks'] as const).map((meal) => (
                  <button
                    key={meal}
                    onClick={() => setActivemeal(meal)}
                    className={`py-4 px-2 border-b-2 font-medium text-sm capitalize transition-colors duration-200 ${
                      activemeal === meal
                        ? 'border-emerald-500 text-emerald-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    {meal}
                    {currentLog.meals[meal].length > 0 && (
                      <span className="ml-2 bg-emerald-100 text-emerald-600 py-1 px-2 rounded-full text-xs">
                        {currentLog.meals[meal].length}
                      </span>
                    )}
                  </button>
                ))}
              </nav>
            </div>

            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-900 capitalize">
                  {activemeal}
                </h3>
                <button
                  onClick={() => setIsAddingFood(true)}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors duration-200"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Food</span>
                </button>
              </div>

              <div className="space-y-3">
                {currentLog.meals[activemeal].length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-gray-500">No foods logged for {activemeal}</p>
                    <button
                      onClick={() => setIsAddingFood(true)}
                      className="mt-2 text-emerald-600 hover:text-emerald-700 font-medium"
                    >
                      Add your first food
                    </button>
                  </div>
                ) : (
                  currentLog.meals[activemeal].map((food, index) => (
                    <FoodItem
                      key={index}
                      food={food}
                      onRemove={() => removeFoodFromMeal(activemeal, index)}
                    />
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Nutrition Insights */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Daily Progress</h3>
              <div className="space-y-4">
                <ProgressBar
                  label="Calories"
                  current={currentLog.totalCalories}
                  target={dailyTargets.calories}
                  color="bg-orange-500"
                />
                <ProgressBar
                  label="Protein"
                  current={currentLog.totalProtein}
                  target={dailyTargets.protein}
                  color="bg-red-500"
                />
                <ProgressBar
                  label="Carbs"
                  current={currentLog.totalCarbs}
                  target={dailyTargets.carbs}
                  color="bg-blue-500"
                />
                <ProgressBar
                  label="Fat"
                  current={currentLog.totalFat}
                  target={dailyTargets.fat}
                  color="bg-yellow-500"
                />
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Nutritional Tips</h3>
              <div className="space-y-3">
                <div className="p-4 bg-green-50 rounded-lg">
                  <h4 className="font-medium text-green-800 mb-1">Balanced Macros</h4>
                  <p className="text-sm text-green-700">
                    Aim for 45-65% carbs, 20-35% fat, and 10-35% protein for optimal health.
                  </p>
                </div>
                <div className="p-4 bg-blue-50 rounded-lg">
                  <h4 className="font-medium text-blue-800 mb-1">Stay Hydrated</h4>
                  <p className="text-sm text-blue-700">
                    Drink at least 8 glasses (2L) of water daily for proper body function.
                  </p>
                </div>
                <div className="p-4 bg-purple-50 rounded-lg">
                  <h4 className="font-medium text-purple-800 mb-1">Meal Timing</h4>
                  <p className="text-sm text-purple-700">
                    Eat regular meals to maintain stable blood sugar and energy levels.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

const MacroCard: React.FC<{
  title: string;
  current: number;
  target: number;
  unit: string;
  color: string;
}> = ({ title, current, target, unit, color }) => {
  const percentage = Math.min((current / target) * 100, 100);
  
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900">
            {Math.round(current)}{unit}
          </p>
          <p className="text-xs text-gray-500">of {target}{unit}</p>
        </div>
        <div className={`p-3 rounded-lg ${color}`}>
          <Target className="w-6 h-6 text-white" />
        </div>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div
          className={`h-2 rounded-full transition-all duration-300 ${color}`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};

const ProgressBar: React.FC<{
  label: string;
  current: number;
  target: number;
  color: string;
}> = ({ label, current, target, color }) => {
  const percentage = Math.min((current / target) * 100, 100);
  
  return (
    <div>
      <div className="flex justify-between text-sm font-medium text-gray-700 mb-1">
        <span>{label}</span>
        <span>{Math.round(current)} / {target}</span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div
          className={`h-2 rounded-full transition-all duration-300 ${color}`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};

const FoodItem: React.FC<{
  food: FoodEntry;
  onRemove: () => void;
}> = ({ food, onRemove }) => (
  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
    <div className="flex-1">
      <h4 className="font-medium text-gray-900">{food.foodName}</h4>
      <div className="flex items-center space-x-4 mt-1 text-sm text-gray-600">
        <span>{food.calories} cal</span>
        <span>{Math.round(food.protein)}g protein</span>
        <span>{Math.round(food.carbs)}g carbs</span>
        <span>{Math.round(food.fat)}g fat</span>
        <span>Qty: {food.quantity}</span>
      </div>
    </div>
    <button
      onClick={onRemove}
      className="text-red-500 hover:text-red-700 p-2"
    >
      ×
    </button>
  </div>
);

const FoodSelector: React.FC<{
  onSelect: (food: FoodEntry) => void;
  onCancel: () => void;
  mealType: string;
}> = ({ onSelect, onCancel, mealType }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFood, setSelectedFood] = useState<typeof foods[0] | null>(null);
  const [quantity, setQuantity] = useState(1);

  const filteredFoods = foods.filter(food =>
    food.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSelect = () => {
    if (!selectedFood) return;

    const foodEntry: FoodEntry = {
      foodId: selectedFood.id,
      foodName: selectedFood.name,
      quantity,
      calories: selectedFood.caloriesPerUnit * quantity,
      protein: selectedFood.protein * quantity,
      carbs: selectedFood.carbs * quantity,
      fat: selectedFood.fat * quantity
    };

    onSelect(foodEntry);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">
            Add Food to {mealType.charAt(0).toUpperCase() + mealType.slice(1)}
          </h2>
          <button
            onClick={onCancel}
            className="text-gray-400 hover:text-gray-600"
          >
            ×
          </button>
        </div>

        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search foods..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="font-medium text-gray-900 mb-3">Foods</h3>
            <div className="max-h-96 overflow-y-auto space-y-2">
              {filteredFoods.map(food => (
                <button
                  key={food.id}
                  onClick={() => setSelectedFood(food)}
                  className={`w-full text-left p-3 rounded-lg border transition-colors duration-200 ${
                    selectedFood?.id === food.id
                      ? 'border-emerald-500 bg-emerald-50'
                      : 'border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  <div className="font-medium text-gray-900">{food.name}</div>
                  <div className="text-sm text-gray-600 mt-1">
                    {food.caloriesPerUnit} cal per {food.unit}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {selectedFood && (
            <div>
              <h3 className="font-medium text-gray-900 mb-3">Nutrition Info</h3>
              <div className="bg-gray-50 rounded-lg p-4 mb-4">
                <h4 className="font-medium text-gray-900 mb-2">{selectedFood.name}</h4>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>Calories: {selectedFood.caloriesPerUnit * quantity}</div>
                  <div>Protein: {Math.round(selectedFood.protein * quantity)}g</div>
                  <div>Carbs: {Math.round(selectedFood.carbs * quantity)}g</div>
                  <div>Fat: {Math.round(selectedFood.fat * quantity)}g</div>
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Quantity ({selectedFood.unit})
                </label>
                <input
                  type="number"
                  min="0.1"
                  step="0.1"
                  value={quantity}
                  onChange={(e) => setQuantity(Number(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                />
              </div>

              <div className="flex space-x-3">
                <button
                  onClick={onCancel}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors duration-200"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSelect}
                  className="flex-1 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-colors duration-200"
                >
                  Add Food
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default NutritionTracker;