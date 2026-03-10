import { motion, AnimatePresence } from 'motion/react';
import { ChevronLeft, Plus, Scan, Trash2, Search, Info, ChefHat, MessageCircle } from 'lucide-react';
import { useNavigate } from 'react-router';
import { useState, useRef, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { productsDatabase, productCategories, searchProducts } from '../utils/productsDatabase';
import { bjuGuide } from '../utils/macroCalculator';
import { AIConsultantChat } from '../components/AIConsultantChat';
import { searchByBarcode } from '../utils/barcodeDatabase';
import { Html5Qrcode } from 'html5-qrcode';

export function Nutrition() {
  const navigate = useNavigate();
  const { state, addMeal, removeMeal, macroTargets } = useApp();
  const [showAddMeal, setShowAddMeal] = useState(false);
  const [showScanner, setShowScanner] = useState(false);
  const [showGuide, setShowGuide] = useState(false);
  const [showProducts, setShowProducts] = useState(false);
  const [showChat, setShowChat] = useState(false);

  const totalCalories = state.meals.reduce((sum, m) => sum + m.calories, 0);
  const totalProtein = state.meals.reduce((sum, m) => sum + m.protein, 0);
  const totalFat = state.meals.reduce((sum, m) => sum + m.fat, 0);
  const totalCarbs = state.meals.reduce((sum, m) => sum + m.carbs, 0);

  return (
    <div className="w-full min-h-screen bg-[#0B0B0F] px-6 pt-12 pb-40 overflow-y-auto">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <button onClick={() => navigate('/')} className="w-10 h-10 rounded-[12px] glass-card flex items-center justify-center active:scale-95 transition-transform">
              <ChevronLeft className="w-5 h-5" />
            </button>
            <h1 className="text-3xl">Питание</h1>
          </div>
          <motion.button 
            whileTap={{ scale: 0.95 }} 
            onClick={() => setShowChat(true)} 
            className="px-3 py-2 bg-gradient-to-r from-[#4DA3FF] to-[#22C55E] rounded-[12px] text-white font-bold flex items-center gap-1.5 shadow-lg shadow-[#4DA3FF]/30"
          >
            <MessageCircle className="w-4 h-4" />
            <span className="text-xs">AI</span>
          </motion.button>
        </div>
        <div className="flex items-center gap-2">
          <motion.button whileTap={{ scale: 0.95 }} onClick={() => setShowGuide(true)} className="w-10 h-10 rounded-[12px] glass-card flex items-center justify-center text-[#4DA3FF]">
            <Info className="w-5 h-5" />
          </motion.button>
          <motion.button whileTap={{ scale: 0.95 }} onClick={() => setShowAddMeal(true)} className="w-10 h-10 rounded-[14px] bg-[#4DA3FF] flex items-center justify-center text-white">
            <Plus className="w-5 h-5" />
          </motion.button>
        </div>
      </motion.div>

      {/* AI Consultant Banner */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card rounded-[20px] p-4 mb-6 bg-gradient-to-r from-[#4DA3FF]/10 to-[#22C55E]/5">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 rounded-[12px] bg-[#4DA3FF]/20 flex items-center justify-center">
            <ChefHat className="w-5 h-5 text-[#4DA3FF]" />
          </div>
          <div>
            <h3 className="text-sm font-bold">AI Нутрициолог</h3>
            <p className="text-xs text-white/50">Персональные рекомендации по питанию</p>
          </div>
        </div>
        <AINutritionist macros={{ protein: totalProtein, fat: totalFat, carbs: totalCarbs, calories: totalCalories }} targets={macroTargets} />
      </motion.div>

      {/* Action Buttons */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        <motion.button initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }} onClick={() => setShowAddMeal(true)} className="glass-card rounded-[16px] p-3 flex flex-col items-center gap-2 active:scale-95 transition-transform">
          <div className="w-10 h-10 rounded-[10px] bg-[#4DA3FF]/20 flex items-center justify-center">
            <Plus className="w-5 h-5 text-[#4DA3FF]" />
          </div>
          <span className="text-xs">Добавить</span>
        </motion.button>

        <motion.button initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} onClick={() => setShowProducts(true)} className="glass-card rounded-[16px] p-3 flex flex-col items-center gap-2 active:scale-95 transition-transform">
          <div className="w-10 h-10 rounded-[10px] bg-[#22C55E]/20 flex items-center justify-center">
            <Search className="w-5 h-5 text-[#22C55E]" />
          </div>
          <span className="text-xs">База</span>
        </motion.button>

        <motion.button initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }} onClick={() => setShowScanner(true)} className="glass-card rounded-[16px] p-3 flex flex-col items-center gap-2 active:scale-95 transition-transform">
          <div className="w-10 h-10 rounded-[10px] bg-[#F59E0B]/20 flex items-center justify-center">
            <Scan className="w-5 h-5 text-[#F59E0B]" />
          </div>
          <span className="text-xs">Сканер</span>
        </motion.button>
      </div>

      {/* Daily Summary */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="glass-card rounded-[24px] p-5 mb-6">
        <h3 className="text-lg mb-4">За сегодня</h3>
        <div className="grid grid-cols-2 gap-3">
          <div className="text-center p-3 rounded-[14px] bg-white/5">
            <p className="text-white/50 text-xs mb-1">Калории</p>
            <p className="text-xl font-bold">{totalCalories}</p>
            <p className="text-white/40 text-xs">{macroTargets.calories} цель</p>
          </div>
          <div className="text-center p-3 rounded-[14px] bg-white/5">
            <p className="text-white/50 text-xs mb-1">Белки</p>
            <p className="text-xl font-bold text-[#4DA3FF]">{totalProtein}г</p>
            <p className="text-white/40 text-xs">{macroTargets.protein}г цель</p>
          </div>
          <div className="text-center p-3 rounded-[14px] bg-white/5">
            <p className="text-white/50 text-xs mb-1">Жиры</p>
            <p className="text-xl font-bold text-[#F59E0B]">{totalFat}г</p>
            <p className="text-white/40 text-xs">{macroTargets.fat}г цель</p>
          </div>
          <div className="text-center p-3 rounded-[14px] bg-white/5">
            <p className="text-white/50 text-xs mb-1">Углеводы</p>
            <p className="text-xl font-bold text-[#22C55E]">{totalCarbs}г</p>
            <p className="text-white/40 text-xs">{macroTargets.carbs}г цель</p>
          </div>
        </div>
      </motion.div>

      {/* Macros Progress */}
      <div className="space-y-3 mb-6">
        <MacroProgress name="Белки" current={totalProtein} target={macroTargets.protein} color="#4DA3FF" />
        <MacroProgress name="Жиры" current={totalFat} target={macroTargets.fat} color="#F59E0B" />
        <MacroProgress name="Углеводы" current={totalCarbs} target={macroTargets.carbs} color="#22C55E" />
      </div>

      {/* Meals List */}
      <div className="space-y-3 mb-6">
        <div className="flex items-center justify-between px-1">
          <p className="text-white/60 text-sm">Приёмы пищи</p>
          <button onClick={() => setShowAddMeal(true)} className="text-[#4DA3FF] text-sm flex items-center gap-1">
            <Plus className="w-4 h-4" />
          </button>
        </div>

        {state.meals.length === 0 ? (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="glass-card rounded-[20px] p-8 text-center">
            <div className="w-16 h-16 rounded-[20px] bg-[#4DA3FF]/20 flex items-center justify-center mx-auto mb-4">
              <Plus className="w-8 h-8 text-[#4DA3FF]" />
            </div>
            <p className="text-white/70 mb-2">Нет записей о приёмах пищи</p>
            <p className="text-white/40 text-sm mb-4">Добавьте первый приём пищи</p>
            <button onClick={() => setShowAddMeal(true)} className="px-6 py-3 bg-[#4DA3FF] rounded-[16px] text-white font-medium">Добавить еду</button>
          </motion.div>
        ) : (
          state.meals.map((meal, index) => (
            <motion.div key={meal.id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 + index * 0.05 }} className="glass-card rounded-[20px] p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="flex-1">
                  <p className="text-white/90 font-medium">{meal.name}</p>
                  <p className="text-white/40 text-xs">{meal.time}</p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <p className="text-lg font-bold">{meal.calories}</p>
                    <p className="text-white/40 text-xs">ккал</p>
                  </div>
                  <button onClick={() => removeMeal(meal.id)} className="w-8 h-8 rounded-full bg-red-500/20 flex items-center justify-center hover:bg-red-500/30 transition-colors">
                    <Trash2 className="w-4 h-4 text-red-500" />
                  </button>
                </div>
              </div>
              <div className="flex items-center gap-4 text-xs text-white/50">
                <span>Б: {meal.protein}г</span>
                <span>Ж: {meal.fat}г</span>
                <span>У: {meal.carbs}г</span>
              </div>
            </motion.div>
          ))
        )}
      </div>

      {/* Modals */}
      <AnimatePresence>
        {showAddMeal && <AddMealModal onClose={() => setShowAddMeal(false)} />}
        {showScanner && <ScannerModal onClose={() => setShowScanner(false)} onAdd={addMeal} />}
        {showProducts && <ProductsModal onClose={() => setShowProducts(false)} onAdd={addMeal} />}
        {showGuide && <GuideModal onClose={() => setShowGuide(false)} />}
        {showChat && <AIConsultantChat type="nutrition" onClose={() => setShowChat(false)} userData={{ macros: { protein: totalProtein, fat: totalFat, carbs: totalCarbs, calories: totalCalories }, targets: macroTargets }} />}
      </AnimatePresence>
    </div>
  );
}

function MacroProgress({ name, current, target, color }: { name: string; current: number; target: number; color: string }) {
  const percentage = Math.min(100, Math.round((current / Math.max(1, target)) * 100));
  
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card rounded-[20px] p-4">
      <div className="flex items-center justify-between mb-2">
        <span className="text-white/90">{name}</span>
        <span className="text-white/60 text-sm">{current} / {target}г</span>
      </div>
      <div className="w-full h-3 bg-white/10 rounded-full overflow-hidden">
        <motion.div initial={{ width: 0 }} animate={{ width: `${percentage}%` }} transition={{ duration: 0.8 }} className="h-full rounded-full" style={{ backgroundColor: color }} />
      </div>
      <p className="text-white/40 text-xs mt-2">{percentage}% от цели</p>
    </motion.div>
  );
}

function AINutritionist({ macros, targets }: { macros: any; targets: any }) {
  return (
    <div className="space-y-2">
      <p className="text-sm text-white/80">
        {macros.calories > 0 
          ? `Вы съели ${macros.calories} ккал. Цель: ${targets.calories} ккал.`
          : 'Добавьте приёмы пищи для получения рекомендаций.'}
      </p>
      {macros.protein < targets.protein * 0.5 && macros.protein > 0 && (
        <p className="text-xs text-[#F59E0B]">⚠️ Мало белка! Нужно ещё {Math.round(targets.protein - macros.protein)}г</p>
      )}
      {macros.calories > targets.calories && (
        <p className="text-xs text-[#EF4444]">⚠️ Превышение калорий на {Math.round(macros.calories - targets.calories)} ккал</p>
      )}
    </div>
  );
}

function AddMealModal({ onClose }: { onClose: () => void }) {
  const { addMeal } = useApp();
  const [name, setName] = useState('');
  const [calories, setCalories] = useState('');
  const [protein, setProtein] = useState('');
  const [fat, setFat] = useState('');
  const [carbs, setCarbs] = useState('');

  const handleSubmit = () => {
    if (!name || !calories) return;
    const now = new Date();
    const time = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
    addMeal({ name, calories: Number(calories), protein: Number(protein) || 0, fat: Number(fat) || 0, carbs: Number(carbs) || 0, time });
    onClose();
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 backdrop-blur-sm" onClick={onClose}>
      <motion.div initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }} onClick={(e) => e.stopPropagation()} className="glass-card rounded-t-[32px] w-full max-w-md p-6 pb-8 max-h-[85vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl">Добавить приём пищи</h2>
          <button onClick={onClose} className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">✕</button>
        </div>
        <div className="space-y-4">
          <div>
            <label className="text-white/60 text-sm mb-2 block">Название блюда</label>
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Например: Овсянка с ягодами" className="w-full glass-card rounded-[16px] px-4 py-3 bg-white/5 outline-none focus:ring-2 focus:ring-[#4DA3FF]" />
          </div>
          <div>
            <label className="text-white/60 text-sm mb-2 block">Калории</label>
            <input type="number" value={calories} onChange={(e) => setCalories(e.target.value)} placeholder="0" className="w-full glass-card rounded-[16px] px-4 py-3 bg-white/5 outline-none focus:ring-2 focus:ring-[#4DA3FF]" />
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="text-white/60 text-sm mb-2 block">Белки (г)</label>
              <input type="number" value={protein} onChange={(e) => setProtein(e.target.value)} placeholder="0" className="w-full glass-card rounded-[16px] px-4 py-3 bg-white/5 outline-none focus:ring-2 focus:ring-[#4DA3FF]" />
            </div>
            <div>
              <label className="text-white/60 text-sm mb-2 block">Жиры (г)</label>
              <input type="number" value={fat} onChange={(e) => setFat(e.target.value)} placeholder="0" className="w-full glass-card rounded-[16px] px-4 py-3 bg-white/5 outline-none focus:ring-2 focus:ring-[#4DA3FF]" />
            </div>
            <div>
              <label className="text-white/60 text-sm mb-2 block">Углеводы (г)</label>
              <input type="number" value={carbs} onChange={(e) => setCarbs(e.target.value)} placeholder="0" className="w-full glass-card rounded-[16px] px-4 py-3 bg-white/5 outline-none focus:ring-2 focus:ring-[#4DA3FF]" />
            </div>
          </div>
          <div className="flex gap-3 pt-4">
            <button onClick={onClose} className="flex-1 py-4 glass-card rounded-[20px] text-white font-medium">Отмена</button>
            <button onClick={handleSubmit} className="flex-1 py-4 bg-[#4DA3FF] rounded-[20px] text-white font-medium">Добавить</button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

function ScannerModal({ onClose, onAdd }: { onClose: () => void; onAdd: (meal: any) => void }) {
  const [barcode, setBarcode] = useState('');
  const [error, setError] = useState('');
  const [scannedProduct, setScannedProduct] = useState<string>('');
  const [isScanning, setIsScanning] = useState(false);
  const [hasFlash, setHasFlash] = useState(false);
  const [flashOn, setFlashOn] = useState(false);
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const [cameraCount, setCameraCount] = useState(0);

  useEffect(() => {
    let html5QrCode: Html5Qrcode | null = null;

    const initScanner = async () => {
      try {
        html5QrCode = new Html5Qrcode('scanner-container');
        scannerRef.current = html5QrCode;

        const cameras = await Html5Qrcode.getCameras();
        console.log('Available cameras:', cameras);
        setCameraCount(cameras.length);

        if (cameras && cameras.length > 0) {
          // Приоритет: задняя камера по label или последняя в списке
          let backCameraId = '';
          
          // Ищем камеру с "back", "rear", "environment" в названии
          for (const cam of cameras) {
            const label = cam.label.toLowerCase();
            if (label.includes('back') || label.includes('rear') || label.includes('environment') || label.includes('задн')) {
              backCameraId = cam.id;
              console.log('Found back camera by label:', cam.label);
              break;
            }
          }
          
          // Если не нашли по label, берём последнюю (обычно это задняя)
          if (!backCameraId) {
            backCameraId = cameras[cameras.length - 1].id;
            console.log('Using last camera:', cameras[cameras.length - 1].label);
          }

          const config = {
            fps: 10,
            qrbox: { width: 250, height: 150 },
            aspectRatio: 1.7778,
            disableFlip: false,
            rememberLastUsedCamera: false,
          };

          await html5QrCode.start(
            backCameraId,
            config,
            onScanSuccess,
            onScanFailure
          );
          
          setIsScanning(true);
          setError('');
          
          // Проверяем наличие фонарика
          const track = html5QrCode.getRunningTrackCapabilities();
          if (track && ('fillLight' in track || 'torch' in track)) {
            setHasFlash(true);
            console.log('Flash available');
          }
        } else {
          setError('Камера не найдена. Используйте ручной ввод.');
        }
      } catch (err) {
        console.error('Camera error:', err);
        setError('Нет доступа к камере. Разрешите доступ или введите код вручную.');
      }
    };

    const onScanSuccess = (decodedText: string) => {
      console.log('✅ Barcode scanned:', decodedText);

      html5QrCode?.stop().then(() => {
        setIsScanning(false);
        setFlashOn(false);

        const product = searchByBarcode(decodedText);
        if (product) {
          setScannedProduct(`${product.name} (${product.store || ''})`);
          const now = new Date();
          const time = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
          onAdd({
            name: product.name,
            calories: product.calories,
            protein: product.protein,
            fat: product.fat,
            carbs: product.carbs,
            time,
          });
          onClose();
        } else {
          setError(`Штрихкод ${decodedText} не найден в базе. Попробуйте ввести вручную.`);
          setBarcode(decodedText);
        }
      }).catch((err) => {
        console.error('Error stopping scanner:', err);
      });
    };

    const onScanFailure = (_: any) => {
      // Игнорируем ошибки сканирования - это нормально
    };

    initScanner();

    return () => {
      if (html5QrCode && html5QrCode.isScanning) {
        html5QrCode.stop().catch((err) => console.error('Error stopping scanner:', err));
      }
    };
  }, []);

  const toggleFlash = async () => {
    try {
      if (scannerRef.current) {
        const newState = !flashOn;
        await scannerRef.current.applyVideoConstraints({
          advanced: [{ torch: newState }]
        } as unknown as MediaTrackConstraints);
        setFlashOn(newState);
        console.log('Flash', newState ? 'ON' : 'OFF');
      }
    } catch (err) {
      console.error('Flash error:', err);
    }
  };

  const handleManualEntry = () => {
    if (barcode.trim()) {
      const product = searchByBarcode(barcode);
      if (product) {
        const now = new Date();
        const time = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
        onAdd({
          name: `${product.name} (${product.store || ''})`,
          calories: product.calories,
          protein: product.protein,
          fat: product.fat,
          carbs: product.carbs,
          time,
        });
        onClose();
      } else {
        alert(`Штрихкод ${barcode} не найден в базе. Попробуйте ввести вручную.`);
      }
    }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[90] flex items-end justify-center bg-black/60 backdrop-blur-sm" onClick={onClose}>
      <motion.div initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }} onClick={(e) => e.stopPropagation()} className="glass-card rounded-t-[32px] w-full max-w-md p-6 pb-40 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl">Сканировать штрихкод</h2>
          <button onClick={() => { scannerRef.current?.stop().catch(() => {}); onClose(); }} className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">✕</button>
        </div>
        <div className="text-center py-4">
          <div className="relative w-full mx-auto mb-4 rounded-[20px] overflow-hidden bg-black" style={{ minHeight: '250px' }}>
            <div
              id="scanner-container"
              className="w-full h-full"
            />
            
            {/* Flash Button */}
            {isScanning && hasFlash && (
              <button
                onClick={toggleFlash}
                className={`absolute top-4 right-4 w-12 h-12 rounded-full flex items-center justify-center transition-all ${flashOn ? 'bg-yellow-500/80' : 'bg-white/20'}`}
              >
                <svg className={`w-6 h-6 ${flashOn ? 'text-white' : 'text-white/70'}`} fill="currentColor" viewBox="0 0 24 24">
                  <path d="M13 2L13 6.09C16.23 6.5 19 9.03 19 12.5C19 15.97 16.23 18.5 13 18.91L13 22L11 22L11 18.91C7.77 18.5 5 15.97 5 12.5C5 9.03 7.77 6.5 11 6.09L11 2L13 2Z"/>
                </svg>
              </button>
            )}
            
            {/* Scanning Frame */}
            {isScanning && (
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="w-64 h-40 border-2 border-[#22C55E]/70 rounded-lg relative">
                  <div className="absolute top-0 left-0 w-4 h-4 border-t-4 border-l-4 border-[#22C55E] -mt-0.5 -ml-0.5" />
                  <div className="absolute top-0 right-0 w-4 h-4 border-t-4 border-r-4 border-[#22C55E] -mt-0.5 -mr-0.5" />
                  <div className="absolute bottom-0 left-0 w-4 h-4 border-b-4 border-l-4 border-[#22C55E] -mb-0.5 -ml-0.5" />
                  <div className="absolute bottom-0 right-0 w-4 h-4 border-b-4 border-r-4 border-[#22C55E] -mb-0.5 -mr-0.5" />
                </div>
              </div>
            )}
          </div>

          {error && (
            <div className="glass-card rounded-[16px] p-3 mb-4 bg-red-500/10 border border-red-500/20">
              <p className="text-red-400 text-sm">{error}</p>
            </div>
          )}
          {scannedProduct && (
            <div className="glass-card rounded-[16px] p-3 mb-4 bg-green-500/10 border border-green-500/20">
              <p className="text-green-400 text-sm">✓ Найдено: {scannedProduct}</p>
            </div>
          )}
          {!isScanning && !error && (
            <p className="text-white/60 mb-4 text-sm">Загрузка камеры...</p>
          )}
          {isScanning && (
            <>
              <p className="text-white/60 mb-4 text-sm">Наведите камеру на штрихкод</p>
              {cameraCount > 0 && (
                <p className="text-white/40 text-xs mb-2">Камер найдено: {cameraCount}</p>
              )}
            </>
          )}
          
          <div className="flex gap-2 mb-4">
            <input
              type="text"
              value={barcode}
              onChange={(e) => setBarcode(e.target.value)}
              placeholder="Или введите код вручную"
              className="flex-1 glass-card rounded-[16px] px-4 py-3 bg-white/5 outline-none focus:ring-2 focus:ring-[#4DA3FF] text-sm"
              onKeyDown={(e) => e.key === 'Enter' && handleManualEntry()}
            />
            <button onClick={handleManualEntry} className="px-4 py-3 bg-[#4DA3FF] rounded-[16px] text-white font-medium text-sm">OK</button>
          </div>

          <div className="glass-card rounded-[16px] p-4 text-left">
            <p className="text-xs text-white/50 mb-2">📌 Инструкция:</p>
            <ol className="text-xs text-white/40 space-y-1">
              <li>1. Разрешите доступ к камере</li>
              <li>2. Наведите штрихкод в зелёную рамку</li>
              <li>3. Продукт добавится автоматически</li>
              <li>4. Или введите код вручную</li>
            </ol>
          </div>
          
          <p className="text-white/40 text-xs mt-4">✅ База штрихкодов: Пятёрочка, Магнит, Лента, Перекрёсток</p>
        </div>
      </motion.div>
    </motion.div>
  );
}

function ProductsModal({ onClose, onAdd }: { onClose: () => void; onAdd: (meal: any) => void }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Все');
  
  const filteredProducts = searchQuery 
    ? searchProducts(searchQuery)
    : selectedCategory === 'Все' 
      ? productsDatabase 
      : productsDatabase.filter(p => p.category === selectedCategory);

  const handleSelectProduct = (product: any) => {
    const now = new Date();
    const time = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
    onAdd({
      name: product.name,
      calories: product.calories,
      protein: product.protein,
      fat: product.fat,
      carbs: product.carbs,
      time,
    });
    onClose();
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 backdrop-blur-sm" onClick={onClose}>
      <motion.div initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }} onClick={(e) => e.stopPropagation()} className="glass-card rounded-t-[32px] w-full max-w-md p-6 pb-8 max-h-[85vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl">База продуктов</h2>
          <button onClick={onClose} className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">✕</button>
        </div>
        
        {/* Search */}
        <div className="mb-4">
          <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Поиск продукта..." className="w-full glass-card rounded-[16px] px-4 py-3 bg-white/5 outline-none focus:ring-2 focus:ring-[#4DA3FF]" />
        </div>
        
        {/* Categories */}
        <div className="flex gap-2 mb-4 overflow-x-auto pb-2">
          {productCategories.map((cat) => (
            <button key={cat} onClick={() => setSelectedCategory(cat)} className={`px-4 py-2 rounded-[12px] text-sm whitespace-nowrap transition-colors ${selectedCategory === cat ? 'bg-[#4DA3FF] text-white' : 'glass-card text-white/70 hover:text-white'}`}>
              {cat}
            </button>
          ))}
        </div>
        
        {/* Products List */}
        <div className="space-y-2">
          {filteredProducts.slice(0, 20).map((product) => (
            <button key={product.id} onClick={() => handleSelectProduct(product)} className="w-full glass-card rounded-[16px] p-4 flex items-center justify-between hover:bg-white/10 transition-colors text-left">
              <div>
                <p className="text-white/90 font-medium">{product.name}</p>
                <p className="text-white/40 text-xs">{product.category}</p>
              </div>
              <div className="text-right">
                <p className="text-lg font-bold">{product.calories}</p>
                <p className="text-white/40 text-xs">Б:{product.protein} Ж:{product.fat} У:{product.carbs}</p>
              </div>
            </button>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
}

function GuideModal({ onClose }: { onClose: () => void }) {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 backdrop-blur-sm" onClick={onClose}>
      <motion.div initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }} onClick={(e) => e.stopPropagation()} className="glass-card rounded-t-[32px] w-full max-w-md p-6 pb-8 max-h-[85vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl">Как считать БЖУ</h2>
          <button onClick={onClose} className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">✕</button>
        </div>
        <div className="prose prose-invert max-w-none">
          {bjuGuide.split('\n').map((line, i) => (
            <p key={i} className={`text-sm text-white/70 mb-3 ${line.startsWith('🤔') || line.startsWith('💡') ? 'text-white font-bold mt-4' : ''} ${line.startsWith('•') ? 'ml-4' : ''}`}>{line}</p>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
}
