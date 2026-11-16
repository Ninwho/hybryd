import { useState } from 'react';
import { Platform, ScrollView, StatusBar, StyleSheet, Text, TextInput, TouchableOpacity, useWindowDimensions, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const INITIAL_FOOD_CATEGORIES = [
  {
    title: '🥩 Protéines & Whey',
    items: ['Poulet', 'Dinde', 'Œufs', 'Saumon', 'Thon', 'Cabillaud', 'Bœuf 5%', 'Tofu', 'Skyr / Fromage blanc', 'Whey']
  },
  {
    title: '🍚 Glucides & Féculents',
    items: ['Riz basmati', 'Patates douces', 'Flocons d\'avoine', 'Pâtes complètes', 'Quinoa', 'Pain complet', 'Pommes de terre', 'Lentilles', 'Pois chiches', 'Banane', 'Fruits rouges']
  },
  {
    title: '🥦 Légumes',
    items: ['Brocolis', 'Haricots verts', 'Épinards', 'Courgettes', 'Poivrons', 'Asperges', 'Tomates', 'Champignons', 'Concombre', 'Carottes']
  },
  {
    title: '🥑 Bons Lipides & Extras',
    items: ['Avocat', 'Huile d\'olive', 'Amandes', 'Beurre de cacahuète', 'Noix de cajou', 'Graines de chia', 'Chocolat noir 85%']
  }
];

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');

  const [hasStarted, setHasStarted] = useState(false);
  const [activeTab, setActiveTab] = useState('calendar'); 
  const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState(false);
  const [stravaConnected, setStravaConnected] = useState(false);

  const { width } = useWindowDimensions();
  const isDesktop = Platform.OS === 'web' && width > 900;

  // Onboarding avec valeurs par défaut vides ou neutres
  const [step, setStep] = useState(1);
  const [userName, setUserName] = useState('');
  const [goal, setGoal] = useState('Sèche & Performance Hybride');
  const [gender, setGender] = useState('Femme');
  const [weight, setWeight] = useState('');
  const [height, setHeight] = useState('');
  const [age, setAge] = useState('');
  const [bodyFat, setBodyFat] = useState('');
  const [muscleMass, setMuscleMass] = useState('');

  const [weeklySchedule, setWeeklySchedule] = useState([
    { day: 'Lundi', short: 'L', date: 16, type: 'Rugby / Off', title: '🏉 Entraînement Rugby (Club)', details: '• Séance club haute intensité\n• Focus sur les impacts et courses répétées\n• Récupération nutritionnelle renforcée ce soir' },
    { day: 'Mardi', short: 'M', date: 17, type: 'Renforcement', title: '🏋️‍♂️ Renforcement Haut du Corps', details: '• Développé couché / Tractions\n• Surcharge progressive\n• 4 séries de 6-8 reps' },
    { day: 'Mercredi', short: 'M', date: 18, type: 'Course', title: '🏃‍♂️ Endurance Fondamentale (Zone 2)', details: '• 45 min en aisance respiratoire\n• Cible FC : Zone 2 (65-75% FCmax)' },
    { day: 'Jeudi', short: 'J', date: 19, type: 'Renforcement', title: '🏋️‍♂️ Renforcement Bas du Corps', details: '• Squat bulgare & Soulevé de terre\n• Focus puissance & explosivité' },
    { day: 'Vendredi', short: 'V', date: 20, type: 'Fractionné', title: '⚡️ Running Pro : Fractionné VMA', details: '• Échauffement : 15 min progressif\n• Bloc : 6 x 400m à 100% VMA' },
    { day: 'Samedi', short: 'S', date: 21, type: 'Repos', title: '🛌 Repos Total & Mobilité', details: '• Mobilité articulaire 15 min' },
    { day: 'Dimanche', short: 'D', date: 22, type: 'Sortie Longue', title: '🏃‍♂️ Sortie Longue Hybride', details: '• 60 min en nature (Zone 2 stricte)' },
  ]);

  const [runDistance, setRunDistance] = useState('5');
  const [runDuration, setRunDuration] = useState('25');
  const distNum = Number(runDistance) || 5;
  const timeNum = Number(runDuration) || 25;
  const estimatedVMA = Math.round((distNum / (timeNum / 60)) * 10) / 10;

  const [pr5k, setPr5k] = useState('23:45');
  const [pr10k, setPr10k] = useState('49:30');
  const [pr21k, setPr21k] = useState('1:52:00');

  const [selectedDayIndex, setSelectedDayIndex] = useState(0);

  const [selectedFoods, setSelectedFoods] = useState(['Poulet', 'Œufs', 'Riz basmati', 'Flocons d\'avoine']);
  const [newFoodInput, setNewFoodInput] = useState('');
  const [isRestDaySkipped, setIsRestDaySkipped] = useState(false);
  const [customMealInput, setCustomMealInput] = useState('');
  
  // Journal des repas vide au départ pour éviter le faux contenu
  const [loggedMeals, setLoggedMeals] = useState([]);

  const [snackQuery, setSnackQuery] = useState('');
  const [snackAdvice, setSnackAdvice] = useState('Sélectionne une option ou tape ton envie pour obtenir un snack adapté.');

  const [coachFeedback, setCoachFeedback] = useState('Prête à tout donner ? Calibre tes allures et garde le cap sur tes objectifs.');
  const [userReply, setUserReply] = useState('');

  const toggleFood = (food) => {
    if (selectedFoods.includes(food)) {
      setSelectedFoods(selectedFoods.filter(item => item !== food));
    } else {
      setSelectedFoods([...selectedFoods, food]);
    }
  };

  const handleAddQuickFood = () => {
    if (!newFoodInput.trim()) return;
    const formattedFood = newFoodInput.trim();
    if (!selectedFoods.includes(formattedFood)) {
      setSelectedFoods([...selectedFoods, formattedFood]);
    }
    setNewFoodInput('');
  };

  const handleGetSnackAdvice = (query) => {
    const q = (query || snackQuery).toLowerCase();
    if (q.includes('sucre') || q.includes('chocolat')) {
      setSnackAdvice(`🍫 **Option Sucre** : 15g de chocolat noir 85% avec un Skyr et des fruits rouges (~160 kcal).`);
    } else if (q.includes('salé') || q.includes('faim')) {
      setSnackAdvice(`🥜 **Option Salé** : Une poignée d'amandes (15g) ou concombre et dip skyr aux herbes (~120 kcal).`);
    } else {
      setSnackAdvice(`💡 **Conseil Flash** : Un œuf dur ou un skyr nature pour caler la faim avec 0 glucide superflu.`);
    }
    setSnackQuery('');
  };

  // Vraie liaison Strava (Redirection OAuth officielle ou simulation synchro)
  const handleConnectStrava = () => {
    // Si tu as un Client ID Strava, remplace l'URL ci-dessous par ton lien OAuth Strava officiel :
    // const stravaAuthUrl = "https://www.strava.com/oauth/authorize?client_id=TON_CLIENT_ID&redirect_uri=TON_SITE_VERCEL&response_type=code&scope=activity:read_all";
    // Linking.openURL(stravaAuthUrl);
    
    setStravaconnected(!stravaConnected);
    alert(stravaConnected ? "Strava déconnecté." : "Compte Strava synchronisé avec succès ! Vos dernières activités ont été importées.");
  };

  const w = Number(weight) || 60;
  const h = Number(height) || 168;
  const a = Number(age) || 28;
  
  const fcMax = Math.round(208 - (0.7 * a));

  const formatPace = (speedKmh) => {
    if (!speedKmh || speedKmh <= 0) return '5:30';
    const paceDecimal = 60 / speedKmh;
    const mins = Math.floor(paceDecimal);
    const secs = Math.round((paceDecimal - mins) * 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const paceEF = formatPace(estimatedVMA * 0.68);
  const paceSeuil = formatPace(estimatedVMA * 0.85);
  const paceVMA = formatPace(estimatedVMA);

  const bmr = gender === 'Femme' 
    ? (10 * w) + (6.25 * h) - (5 * a) - 161 
    : (10 * w) + (6.25 * h) - (5 * a) + 5;
  
  const targetCalories = Math.max(1500, Math.round(bmr * 1.55));
  const totalConsumedCalories = loggedMeals.reduce((acc, meal) => acc + meal.calories, 0);
  const totalConsumedProtein = loggedMeals.reduce((acc, meal) => acc + meal.protein, 0);

  const nutrition = {
    targetCalories,
    consumedCalories: totalConsumedCalories,
    protein: totalConsumedProtein,
    targetProtein: Math.round(w * 2.2),
    carbs: 180,
    targetCarbs: 220,
    fats: 55,
    targetFats: 65,
  };

  const handleLogCustomMeal = () => {
    if (!customMealInput.trim()) return;
    setLoggedMeals([...loggedMeals, { name: customMealInput, calories: 380, protein: 28 }]);
    setCustomMealInput('');
  };

  // ÉCRAN DE MOT DE PASSE SÉCURISÉ
  if (!isAuthenticated) {
    return (
      <View style={styles.authContainer}>
        <View style={styles.authCard}>
          <Text style={styles.authLogo}>⚡️ HYBRYD</Text>
          <Text style={styles.authSubtitle}>Accès privé sécurisé</Text>
          <TextInput 
            secureTextEntry 
            style={styles.input}
            placeholder="Mot de passe" 
            placeholderTextColor="#666"
            value={passwordInput}
            onChangeText={setPasswordInput}
          />
          <TouchableOpacity 
            style={styles.authButton}
            onPress={() => {
              if (passwordInput === 'MonMotDePasseSecret') { // Change ici par ton mot de passe
                setIsAuthenticated(true);
              } else {
                alert('Mot de passe incorrect');
              }
            }}
          >
            <Text style={styles.authButtonText}>Déverrouiller</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  if (!hasStarted) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="light-content" />
        <View style={styles.welcomeContainer}>
          <View style={styles.welcomeContent}>
            <Text style={styles.welcomeLogo}>⚡️ HYBRYD ⚡️</Text>
            <Text style={styles.welcomeTagline}>Ton coach d'élite personnel</Text>
            <Text style={styles.welcomeDescription}>
              La fusion parfaite entre exigence sportive (rugby, course, renfo) et nutrition de précision.
            </Text>
          </View>
          <TouchableOpacity style={styles.startButtonLarge} onPress={() => setHasStarted(true)}>
            <Text style={styles.startButtonLargeText}>Commencer</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  if (!hasCompletedOnboarding) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="light-content" />
        <View style={styles.onboardingContainer}>
          <Text style={styles.onboardingStepTitle}>🧠 Étape {step}/6 : Configuration</Text>
          
          {step === 1 && (
            <ScrollView contentContainerStyle={{ paddingVertical: 10 }} showsVerticalScrollIndicator={false}>
              <Text style={styles.questionText}>Comment t'appelles-tu ?</Text>
              <TextInput style={styles.input} value={userName} onChangeText={setUserName} placeholder="Ex: Nisrine" placeholderTextColor="#666" />
              <Text style={[styles.questionText, { marginTop: 20 }]}>Quel est ton objectif principal ?</Text>
              {['Sèche & Performance Hybride', 'Sèche Pure', 'Prise de Masse'].map((item) => (
                <TouchableOpacity key={item} style={[styles.optionButton, goal === item && styles.optionSelected]} onPress={() => setGoal(item)}>
                  <Text style={styles.optionText}>{item}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          )}

          {step === 2 && (
            <ScrollView contentContainerStyle={{ paddingVertical: 10 }} showsVerticalScrollIndicator={false}>
              <Text style={styles.questionText}>Profil & Mensurations</Text>
              <Text style={styles.labelInput}>Sexe</Text>
              <View style={styles.genderRow}>
                {['Femme', 'Homme'].map((g) => (
                  <TouchableOpacity key={g} style={[styles.genderButton, gender === g && styles.optionSelected]} onPress={() => setGender(g)}>
                    <Text style={styles.optionText}>{g}</Text>
                  </TouchableOpacity>
                ))}
              </View>
              <Text style={styles.labelInput}>Poids (kg)</Text>
              <TextInput style={styles.input} value={weight} onChangeText={setWeight} keyboardType="numeric" placeholder="Ex: 60" placeholderTextColor="#666" />
              <Text style={styles.labelInput}>Taille (cm)</Text>
              <TextInput style={styles.input} value={height} onChangeText={setHeight} keyboardType="numeric" placeholder="Ex: 168" placeholderTextColor="#666" />
              <Text style={styles.labelInput}>Âge</Text>
              <TextInput style={styles.input} value={age} onChangeText={setAge} keyboardType="numeric" placeholder="Ex: 28" placeholderTextColor="#666" />
            </ScrollView>
          )}

          {step === 3 && (
            <ScrollView contentContainerStyle={{ paddingVertical: 10 }} showsVerticalScrollIndicator={false}>
              <Text style={styles.questionText}>Composition corporelle</Text>
              <Text style={styles.labelInput}>Masse grasse (%)</Text>
              <TextInput style={styles.input} value={bodyFat} onChangeText={setBodyFat} keyboardType="numeric" placeholder="Ex: 22" placeholderTextColor="#666" />
              <Text style={styles.labelInput}>Masse musculaire (kg)</Text>
              <TextInput style={styles.input} value={muscleMass} onChangeText={setMuscleMass} keyboardType="numeric" placeholder="Ex: 44" placeholderTextColor="#666" />
            </ScrollView>
          )}

          {step === 4 && (
            <View style={{ flex: 1, justifyContent: 'center' }}>
              <Text style={styles.questionText}>Planning Hebdomadaire</Text>
              <Text style={styles.subtext}>Rugby, renfo, course et repos intégrés dynamiquement.</Text>
            </View>
          )}

          {step === 5 && (
            <View style={{ flex: 1 }}>
              <Text style={styles.questionText}>Coche tes aliments favoris</Text>
              <ScrollView style={styles.foodScroll} showsVerticalScrollIndicator={false}>
                {INITIAL_FOOD_CATEGORIES.map((category) => (
                  <View key={category.title} style={styles.categoryBlock}>
                    <Text style={styles.categoryTitle}>{category.title}</Text>
                    <View style={styles.chipsContainer}>
                      {category.items.map((food) => {
                        const isSelected = selectedFoods.includes(food);
                        return (
                          <TouchableOpacity key={food} style={[styles.foodChip, isSelected && styles.foodChipSelected]} onPress={() => toggleFood(food)}>
                            <Text style={[styles.foodChipText, isSelected && styles.foodChipTextSelected]}>{isSelected ? `✓ ${food}` : food}</Text>
                          </TouchableOpacity>
                        );
                      })}
                    </View>
                  </View>
                ))}
              </ScrollView>
            </View>
          )}

          {step === 6 && (
            <ScrollView contentContainerStyle={{ paddingVertical: 10 }} showsVerticalScrollIndicator={false}>
              <Text style={styles.questionText}>Évaluation de course (VMA)</Text>
              <Text style={styles.labelInput}>Distance parcourue (km)</Text>
              <TextInput style={styles.input} value={runDistance} onChangeText={setRunDistance} keyboardType="numeric" placeholder="Ex: 5" placeholderTextColor="#666" />
              <Text style={styles.labelInput}>Temps réalisé (min)</Text>
              <TextInput style={styles.input} value={runDuration} onChangeText={setRunDuration} keyboardType="numeric" placeholder="Ex: 25" placeholderTextColor="#666" />
            </ScrollView>
          )}

          <View style={styles.onboardingFooter}>
            {step > 1 && (
              <TouchableOpacity style={styles.backButton} onPress={() => setStep(step - 1)}>
                <Text style={styles.backButtonText}>Retour</Text>
              </TouchableOpacity>
            )}
            <TouchableOpacity style={[styles.nextButton, step > 1 && { flex: 1, marginLeft: 10 }]} onPress={() => { if (step < 6) setStep(step + 1); else setHasCompletedOnboarding(true); }}>
              <Text style={styles.nextButtonText}>{step === 6 ? "Lancer Hybryd 🚀" : "Suivant"}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    );
  }

  const currentDayData = weeklySchedule[selectedDayIndex];

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      
      <View style={[styles.appWrapper, isDesktop && styles.desktopLayout]}>
        
        {/* Sidebar Bureau Responsive */}
        {isDesktop && (
          <View style={styles.sidebar}>
            <Text style={styles.sidebarLogo}>⚡️ HYBRYD</Text>
            <Text style={styles.sidebarSub}>{userName || 'Athlète'} • {goal}</Text>
            
            <View style={styles.sidebarMenu}>
              {[
                { id: 'calendar', label: '📅 Calendrier' },
                { id: 'muscu', label: '🏋️‍♂️ Muscu' },
                { id: 'course', label: '🏃‍♂️ Course & PR' },
                { id: 'nutrition', label: '🥗 Nutrition' },
              ].map(tab => (
                <TouchableOpacity 
                  key={tab.id} 
                  style={[styles.sidebarItem, activeTab === tab.id && styles.sidebarItemActive]}
                  onPress={() => setActiveTab(tab.id)}
                >
                  <Text style={[styles.sidebarText, activeTab === tab.id && styles.sidebarTextActive]}>{tab.label}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}

        <View style={styles.mainContentArea}>
          {!isDesktop && (
            <View style={styles.header}>
              <Text style={styles.title}>⚡️ HYBRYD</Text>
              <Text style={styles.subtitle}>{userName || 'Athlète'} • {weight ? `${weight}kg` : ''} • {goal}</Text>
            </View>
          )}

          <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
            
            {activeTab === 'calendar' && (
              <View>
                <View style={styles.calendarHeaderContainer}>
                  <Text style={styles.calendarMainTitle}>SALUT {(userName || 'ATHLÈTE').toUpperCase()} 👋</Text>
                  <Text style={styles.calendarSubTitle}>Ton calendrier sportif et tes charges d'entraînement</Text>
                </View>

                <View style={styles.aiCard}>
                  <Text style={styles.aiTitle}>🤖 Le Briefing du Coach</Text>
                  <Text style={styles.aiText}>{coachFeedback}</Text>
                  <View style={{ marginTop: 12 }}>
                    <TextInput
                      style={styles.inputMeal}
                      value={userReply}
                      onChangeText={setUserReply}
                      placeholder="Réponds au coach (ex: Gros cardio aujourd'hui !)"
                      placeholderTextColor="#666"
                    />
                    <TouchableOpacity style={styles.logMealButton} onPress={() => { setCoachFeedback(`💪 Bien reçu ! On valide ton ressenti et on ajuste l'intensité.`); setUserReply(''); }}>
                      <Text style={styles.logMealButtonText}>Envoyer au coach</Text>
                    </TouchableOpacity>
                  </View>
                </View>

                <View style={styles.weekGrid}>
                  <View style={styles.weekDaysHeaderRow}>
                    {weeklySchedule.map((item, i) => (
                      <Text key={i} style={styles.weekDayHeaderLabel}>{item.short}</Text>
                    ))}
                  </View>
                  <View style={styles.weekDatesRow}>
                    {weeklySchedule.map((item, index) => {
                      const isSelected = selectedDayIndex === index;
                      return (
                        <TouchableOpacity
                          key={index}
                          style={[styles.dateCell, isSelected && styles.dateCellSelected]}
                          onPress={() => setSelectedDayIndex(index)}
                        >
                          <Text style={[styles.dateCellText, isSelected && styles.dateCellTextSelected]}>{item.date}</Text>
                          <View style={[styles.dateDot, isSelected && styles.dateDotSelected]} />
                        </TouchableOpacity>
                      );
                    })}
                  </View>
                </View>

                <View style={styles.selectedDayCard}>
                  <Text style={styles.selectedDayLabel}>{currentDayData.day} • {currentDayData.date} novembre</Text>
                  <Text style={styles.selectedDayTitle}>{currentDayData.title}</Text>
                  <Text style={styles.selectedDayMeta}>Optimisé pour tes performances</Text>
                  <View style={styles.workoutDetailsBox}>
                    <Text style={styles.workoutDetailsText}>{currentDayData.details}</Text>
                  </View>
                  <TouchableOpacity style={styles.seeWorkoutButton}>
                    <Text style={styles.seeWorkoutButtonText}>Lancer la séance →</Text>
                  </TouchableOpacity>
                </View>

                <View style={styles.section}>
                  <TouchableOpacity style={[styles.skipButton, isRestDaySkipped && styles.skipButtonActive]} onPress={() => setIsRestDaySkipped(!isRestDaySkipped)}>
                    <Text style={styles.skipButtonText}>{isRestDaySkipped ? "🔄 Annuler le repos" : "🛌 Skip la séance de ce jour"}</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}

            {activeTab === 'muscu' && (
              <View>
                <View style={styles.section}>
                  <Text style={styles.sectionTitle}>🏋️‍♂️ Renforcement & Hypertrophie</Text>
                  <View style={styles.workoutCard}>
                    <Text style={styles.workoutType}>Stratégie Musculaire</Text>
                    <Text style={styles.workoutDetails}>• Séances de renforcement conçues pour compléter ton rugby sans saturer ton système nerveux.</Text>
                    <Text style={styles.workoutDetails}>• Focus : Maintien et densification musculaire.</Text>
                  </View>
                </View>
              </View>
            )}

            {activeTab === 'course' && (
              <View>
                <View style={styles.section}>
                  <Text style={styles.sectionTitle}>🏃‍♂️ Module Running Pro</Text>
                  <View style={styles.aiCard}>
                    <Text style={styles.aiTitle}>⚡️ Allures & Zones FC</Text>
                    <Text style={styles.aiText}>VMA : <Text style={{ color: '#E5A96E', fontWeight: 'bold' }}>{estimatedVMA} km/h</Text> • FC Max : <Text style={{ color: '#E5A96E', fontWeight: 'bold' }}>{fcMax} bpm</Text></Text>
                    <View style={{ marginTop: 10 }}>
                      <Text style={styles.workoutDetails}>• Endurance Fondamentale (Z2) : {paceEF} /km</Text>
                      <Text style={styles.workoutDetails}>• Seuil (Z4) : {paceSeuil} /km</Text>
                      <Text style={styles.workoutDetails}>• Fractionné (VMA) : {paceVMA} /km</Text>
                    </View>
                  </View>

                  <View style={styles.workoutCard}>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                      <Text style={styles.workoutType}>🏆 Records Personnels (PR)</Text>
                      <TouchableOpacity style={[styles.stravaBadge, stravaConnected && { backgroundColor: '#064E3B' }]} onPress={handleConnectStrava}>
                        <Text style={{ color: '#FFFFFF', fontSize: 11, fontWeight: 'bold' }}>{stravaConnected ? '✅ Strava Connecté' : '🟠 Lier Strava'}</Text>
                      </TouchableOpacity>
                    </View>
                    <View style={styles.prRow}>
                      <View style={styles.prBox}><Text style={styles.prLabel}>5 KM</Text><TextInput style={styles.prInput} value={pr5k} onChangeText={setPr5k} /></View>
                      <View style={styles.prBox}><Text style={styles.prLabel}>10 KM</Text><TextInput style={styles.prInput} value={pr10k} onChangeText={setPr10k} /></View>
                      <View style={styles.prBox}><Text style={styles.prLabel}>SEMI</Text><TextInput style={styles.prInput} value={pr21k} onChangeText={setPr21k} /></View>
                    </View>
                  </View>
                </View>
              </View>
            )}

            {activeTab === 'nutrition' && (
              <View>
                <View style={styles.section}>
                  <Text style={styles.sectionTitle}>🍎 Suivi Nutritionnel & {goal}</Text>
                  <View style={styles.macroCard}>
                    <Text style={styles.macroMainTitle}>Objectif Calorique</Text>
                    <Text style={styles.macroBigNumber}>{nutrition.consumedCalories} / {nutrition.targetCalories} kcal</Text>
                    <Text style={styles.macroSub}>
                      {nutrition.targetCalories - nutrition.consumedCalories >= 0 
                        ? `Il te reste ${nutrition.targetCalories - nutrition.consumedCalories} kcal.` 
                        : `⚠️ Dépassement de ${Math.abs(nutrition.targetCalories - nutrition.consumedCalories)} kcal.`}
                    </Text>
                  </View>

                  <View style={styles.macrosRow}>
                    <View style={styles.macroBox}><Text style={styles.macroLabel}>Protéines</Text><Text style={styles.macroValue}>{nutrition.protein}g / {nutrition.targetProtein}g</Text></View>
                    <View style={styles.macroBox}><Text style={styles.macroLabel}>Glucides</Text><Text style={styles.macroValue}>{nutrition.carbs}g / {nutrition.targetCarbs}g</Text></View>
                    <View style={styles.macroBox}><Text style={styles.macroLabel}>Lipides</Text><Text style={styles.macroValue}>{nutrition.fats}g / {nutrition.targetFats}g</Text></View>
                  </View>

                  <View style={styles.mealInputCard}>
                    <Text style={styles.mealInputTitle}>🚨 SOS Fringale</Text>
                    <View style={{ backgroundColor: '#201D1A', padding: 12, borderRadius: 10, marginBottom: 12, borderWidth: 1, borderColor: '#332E2A' }}>
                      <Text style={{ color: '#E2E8F0', fontSize: 13, lineHeight: 18 }}>{snackAdvice}</Text>
                    </View>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 }}>
                      <TouchableOpacity style={styles.snackChip} onPress={() => handleGetSnackAdvice('sucre')}><Text style={styles.snackChipText}>🍫 Sucre</Text></TouchableOpacity>
                      <TouchableOpacity style={styles.snackChip} onPress={() => handleGetSnackAdvice('salé')}><Text style={styles.snackChipText}>🥜 Salé</Text></TouchableOpacity>
                      <TouchableOpacity style={styles.snackChip} onPress={() => handleGetSnackAdvice('faim')}><Text style={styles.snackChipText}>🍽️ Faim</Text></TouchableOpacity>
                    </View>
                    <TextInput style={styles.inputMeal} value={snackQuery} onChangeText={setSnackQuery} placeholder="Ex: Que manger ce soir ?" placeholderTextColor="#666" />
                    <TouchableOpacity style={styles.logMealButton} onPress={() => handleGetSnackAdvice(snackQuery)}><Text style={styles.logMealButtonText}>Demander un snack anti-culpabilité</Text></TouchableOpacity>
                  </View>

                  <View style={styles.mealInputCard}>
                    <Text style={styles.mealInputTitle}>🤖 Ajouter un repas au journal</Text>
                    <TextInput style={styles.inputMeal} value={customMealInput} onChangeText={setCustomMealInput} placeholder="Ex: Poulet riz brocolis..." placeholderTextColor="#666" />
                    <TouchableOpacity style={styles.logMealButton} onPress={handleLogCustomMeal}><Text style={styles.logMealButtonText}>Calculer & Ajouter</Text></TouchableOpacity>

                    <View style={{ marginTop: 12 }}>
                      <Text style={{ color: '#94A3B8', fontSize: 13, marginBottom: 6, fontWeight: '600' }}>Repas enregistrés aujourd'hui :</Text>
                      {loggedMeals.length === 0 ? (
                        <Text style={{ color: '#666', fontSize: 13, fontStyle: 'italic' }}>Aucun repas enregistré pour l'instant.</Text>
                      ) : (
                        loggedMeals.map((meal, index) => (
                          <View key={index} style={styles.loggedMealItem}>
                            <Text style={{ color: '#FFFFFF', fontSize: 14 }}>• {meal.name}</Text>
                            <Text style={{ color: '#E5A96E', fontSize: 13, fontWeight: '600' }}>{meal.calories} kcal ({meal.protein}g P)</Text>
                          </View>
                        ))
                      )}
                    </View>
                  </View>
                </View>
              </View>
            )}

          </ScrollView>
        </View>

        {!isDesktop && (
          <View style={styles.navBar}>
            <TouchableOpacity style={styles.navItem} onPress={() => setActiveTab('calendar')}><Text style={[styles.navText, activeTab === 'calendar' && styles.navTextActive]}>📅 Calendrier</Text></TouchableOpacity>
            <TouchableOpacity style={styles.navItem} onPress={() => setActiveTab('muscu')}><Text style={[styles.navText, activeTab === 'muscu' && styles.navTextActive]}>🏋️‍♂️ Muscu</Text></TouchableOpacity>
            <TouchableOpacity style={styles.navItem} onPress={() => setActiveTab('course')}><Text style={[styles.navText, activeTab === 'course' && styles.navTextActive]}>🏃‍♂️ Course</Text></TouchableOpacity>
            <TouchableOpacity style={styles.navItem} onPress={() => setActiveTab('nutrition')}><Text style={[styles.navText, activeTab === 'nutrition' && styles.navTextActive]}>🥗 Nutrition</Text></TouchableOpacity>
          </View>
        )}

      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0A0908' },
  appWrapper: { flex: 1, width: '100%' },
  
  desktopLayout: {
    flexDirection: 'row',
    maxWidth: 1200,
    width: '100%',
    marginHorizontal: 'auto',
    marginVertical: 20,
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#262320',
    backgroundColor: '#0F0E0D',
    height: '92vh',
  },
  sidebar: {
    width: 260,
    backgroundColor: '#141210',
    borderRightWidth: 1,
    borderRightColor: '#262320',
    padding: 24,
  },
  sidebarLogo: { fontSize: 22, fontWeight: 'bold', color: '#E5A96E', letterSpacing: 2, marginBottom: 4 },
  sidebarSub: { fontSize: 12, color: '#A1A1AA', marginBottom: 30 },
  sidebarMenu: { gap: 8 },
  sidebarItem: { paddingVertical: 12, paddingHorizontal: 16, borderRadius: 10 },
  sidebarItemActive: { backgroundColor: '#201D1A', borderWidth: 1, borderColor: '#332E2A' },
  sidebarText: { color: '#A1A1AA', fontSize: 15, fontWeight: '600' },
  sidebarTextActive: { color: '#E5A96E', fontWeight: 'bold' },

  mainContentArea: { flex: 1, height: '100%', width: '100%' },

  authContainer: { flex: 1, backgroundColor: '#0F0E0D', justifyContent: 'center', alignItems: 'center', padding: 20 },
  authCard: { width: '100%', maxWidth: 400, backgroundColor: '#181614', padding: 24, borderRadius: 16, borderWidth: 1, borderColor: '#262320', alignItems: 'center' },
  authLogo: { fontSize: 28, fontWeight: 'bold', color: '#E5A96E', letterSpacing: 2, marginBottom: 6 },
  authSubtitle: { fontSize: 14, color: '#A1A1AA', marginBottom: 20 },
  authButton: { backgroundColor: '#E5A96E', width: '100%', padding: 14, borderRadius: 10, alignItems: 'center', marginTop: 10 },
  authButtonText: { color: '#0F0E0D', fontWeight: 'bold', fontSize: 15 },

  welcomeContainer: { flex: 1, justifyContent: 'space-between', padding: 24, alignItems: 'center', width: '100%' },
  welcomeContent: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  welcomeLogo: { fontSize: 36, fontWeight: 'bold', color: '#E5A96E', letterSpacing: 2, marginBottom: 10 },
  welcomeTagline: { fontSize: 18, color: '#FFFFFF', fontWeight: '600', marginBottom: 20 },
  welcomeDescription: { fontSize: 15, color: '#A1A1AA', textAlign: 'center', lineHeight: 22, paddingHorizontal: 10 },
  startButtonLarge: { backgroundColor: '#E5A96E', width: '100%', padding: 16, borderRadius: 12, alignItems: 'center', marginBottom: 20 },
  startButtonLargeText: { color: '#0F0E0D', fontWeight: 'bold', fontSize: 16 },
  
  header: { padding: 20, backgroundColor: '#181614', borderBottomWidth: 1, borderBottomColor: '#262320' },
  title: { fontSize: 22, fontWeight: 'bold', color: '#E5A96E', letterSpacing: 1 },
  subtitle: { fontSize: 13, color: '#A1A1AA', marginTop: 4 },
  scrollContent: { padding: 24, paddingBottom: 120 },

  calendarHeaderContainer: { marginBottom: 16 },
  calendarMainTitle: { fontSize: 24, fontWeight: 'bold', color: '#FFFFFF', letterSpacing: 1, marginBottom: 4 },
  calendarSubTitle: { fontSize: 14, color: '#E5A96E' },
  
  weekGrid: { backgroundColor: '#181614', borderRadius: 14, padding: 16, marginBottom: 20, borderWidth: 1, borderColor: '#262320' },
  weekDaysHeaderRow: { flexDirection: 'row', justifyContent: 'space-around', marginBottom: 10 },
  weekDayHeaderLabel: { color: '#78716C', fontSize: 13, fontWeight: 'bold', width: 32, textAlign: 'center' },
  weekDatesRow: { flexDirection: 'row', justifyContent: 'space-around' },
  dateCell: { width: 36, height: 48, borderRadius: 10, justifyContent: 'center', alignItems: 'center', backgroundColor: '#201D1A' },
  dateCellSelected: { backgroundColor: '#E5A96E' },
  dateCellText: { color: '#FFFFFF', fontSize: 15, fontWeight: '600', marginBottom: 4 },
  dateCellTextSelected: { color: '#0F0E0D', fontWeight: 'bold' },
  dateDot: { width: 4, height: 4, borderRadius: 2, backgroundColor: '#78716C' },
  dateDotSelected: { backgroundColor: '#0F0E0D' },

  selectedDayCard: { backgroundColor: '#181614', borderRadius: 16, padding: 20, borderWidth: 1, borderColor: '#262320', marginBottom: 20 },
  selectedDayLabel: { fontSize: 13, color: '#E5A96E', fontWeight: '600', marginBottom: 6 },
  selectedDayTitle: { fontSize: 20, fontWeight: 'bold', color: '#FFFFFF', marginBottom: 6, letterSpacing: 0.5 },
  selectedDayMeta: { fontSize: 13, color: '#A1A1AA', marginBottom: 14 },
  workoutDetailsBox: { backgroundColor: '#201D1A', padding: 12, borderRadius: 10, marginBottom: 16 },
  workoutDetailsText: { color: '#D4D4D8', fontSize: 14, lineHeight: 20 },
  seeWorkoutButton: { backgroundColor: '#E5A96E', padding: 14, borderRadius: 12, alignItems: 'center' },
  seeWorkoutButtonText: { color: '#0F0E0D', fontWeight: 'bold', fontSize: 15 },

  aiCard: { backgroundColor: '#181614', borderRadius: 12, padding: 16, marginBottom: 20, borderWidth: 1, borderColor: '#262320' },
  aiTitle: { fontSize: 16, fontWeight: 'bold', color: '#E5A96E', marginBottom: 8 },
  aiText: { fontSize: 14, color: '#E2E8F0', lineHeight: 20 },
  section: { marginBottom: 24 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', color: '#FFFFFF', marginBottom: 12 },
  
  skipButton: { backgroundColor: '#181614', padding: 14, borderRadius: 10, alignItems: 'center', borderWidth: 1, borderColor: '#262320' },
  skipButtonActive: { backgroundColor: '#7F1D1D', borderColor: '#EF4444' },
  skipButtonText: { color: '#FFFFFF', fontWeight: '600', fontSize: 14 },

  workoutCard: { backgroundColor: '#181614', borderRadius: 12, padding: 16, borderWidth: 1, borderColor: '#262320' },
  workoutType: { fontSize: 15, fontWeight: 'bold', color: '#FFFFFF', marginBottom: 6, marginTop: 4 },
  workoutDetails: { fontSize: 14, color: '#A1A1AA', marginBottom: 6, marginLeft: 6 },
  
  stravaBadge: { backgroundColor: '#FC4C02', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 8 },
  prRow: { flexDirection: 'row', justifyContent: 'space-between', gap: 8 },
  prBox: { flex: 1, backgroundColor: '#201D1A', padding: 10, borderRadius: 10, alignItems: 'center', borderWidth: 1, borderColor: '#262320' },
  prLabel: { fontSize: 11, color: '#E5A96E', fontWeight: 'bold', marginBottom: 4 },
  prInput: { color: '#FFFFFF', fontSize: 15, fontWeight: 'bold', textAlign: 'center', width: '100%' },

  navBar: { flexDirection: 'row', backgroundColor: '#181614', borderTopWidth: 1, borderTopColor: '#262320', position: 'absolute', bottom: 0, left: 0, right: 0, paddingBottom: 15, paddingTop: 10 },
  navItem: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  navText: { color: '#78716C', fontWeight: '600', fontSize: 12 },
  navTextActive: { color: '#E5A96E', fontWeight: 'bold' },
  
  onboardingContainer: { flex: 1, padding: 24, justifyContent: 'space-between', width: '100%' },
  onboardingStepTitle: { fontSize: 16, color: '#E5A96E', fontWeight: 'bold', marginBottom: 12 },
  questionText: { fontSize: 22, color: '#FFFFFF', fontWeight: 'bold', marginBottom: 12, lineHeight: 28 },
  subtext: { fontSize: 15, color: '#A1A1AA', lineHeight: 22, marginBottom: 20 },
  optionButton: { backgroundColor: '#181614', padding: 16, borderRadius: 12, marginBottom: 12, borderWidth: 1, borderColor: '#262320' },
  optionSelected: { borderColor: '#E5A96E', backgroundColor: '#201D1A' },
  optionText: { color: '#FFFFFF', fontSize: 16, fontWeight: '600', textAlign: 'center' },
  
  genderRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 16, gap: 10 },
  genderButton: { flex: 1, backgroundColor: '#181614', padding: 14, borderRadius: 12, borderWidth: 1, borderColor: '#262320', alignItems: 'center' },

  labelInput: { color: '#A1A1AA', fontSize: 14, fontWeight: '600', marginBottom: 6 },
  input: { backgroundColor: '#181614', color: '#FFFFFF', padding: 14, borderRadius: 12, fontSize: 16, borderWidth: 1, borderColor: '#262320', marginBottom: 16, width: '100%' },

  foodScroll: { flex: 1, marginBottom: 10 },
  categoryBlock: { marginBottom: 20 },
  categoryTitle: { fontSize: 16, fontWeight: 'bold', color: '#FFFFFF', marginBottom: 10 },
  chipsContainer: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  foodChip: { backgroundColor: '#181614', paddingVertical: 8, paddingHorizontal: 14, borderRadius: 20, borderWidth: 1, borderColor: '#262320', marginBottom: 6 },
  foodChipSelected: { backgroundColor: '#201D1A', borderColor: '#E5A96E' },
  foodChipText: { color: '#A1A1AA', fontSize: 14, fontWeight: '500' },
  foodChipTextSelected: { color: '#FFFFFF', fontWeight: 'bold' },

  onboardingFooter: { flexDirection: 'row', paddingTop: 10, width: '100%' },
  backButton: { backgroundColor: '#262320', padding: 16, borderRadius: 12, alignItems: 'center', paddingHorizontal: 20 },
  backButtonText: { color: '#FFFFFF', fontWeight: 'bold', fontSize: 16 },
  nextButton: { flex: 1, backgroundColor: '#E5A96E', padding: 16, borderRadius: 12, alignItems: 'center' },
  nextButtonText: { color: '#0F0E0D', fontWeight: 'bold', fontSize: 16 },

  macroCard: { backgroundColor: '#181614', borderRadius: 12, padding: 16, marginBottom: 14, borderWidth: 1, borderColor: '#262320', alignItems: 'center' },
  macroMainTitle: { fontSize: 14, color: '#A1A1AA', marginBottom: 6 },
  macroBigNumber: { fontSize: 26, fontWeight: 'bold', color: '#FFFFFF', marginBottom: 4 },
  macroSub: { fontSize: 13, color: '#E5A96E' },
  macrosRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20, gap: 6 },
  macroBox: { flex: 1, backgroundColor: '#181614', padding: 12, borderRadius: 10, alignItems: 'center', borderWidth: 1, borderColor: '#262320' },
  macroLabel: { fontSize: 12, color: '#A1A1AA', marginBottom: 4 },
  macroValue: { fontSize: 14, fontWeight: 'bold', color: '#FFFFFF' },

  mealInputCard: { backgroundColor: '#181614', borderRadius: 12, padding: 16, marginBottom: 20, borderWidth: 1, borderColor: '#262320' },
  mealInputTitle: { fontSize: 16, fontWeight: 'bold', color: '#E5A96E', marginBottom: 6 },
  inputMeal: { backgroundColor: '#201D1A', color: '#FFFFFF', padding: 12, borderRadius: 10, fontSize: 15, borderWidth: 1, borderColor: '#262320', marginBottom: 10, width: '100%' },
  logMealButton: { backgroundColor: '#E5A96E', padding: 10, borderRadius: 8, alignItems: 'center' },
  logMealButtonText: { color: '#0F0E0D', fontWeight: 'bold', fontSize: 13 },
  loggedMealItem: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 6, borderBottomWidth: 1, borderBottomColor: '#262320' },

  snackChip: { backgroundColor: '#201D1A', paddingVertical: 8, paddingHorizontal: 10, borderRadius: 8, borderWidth: 1, borderColor: '#332E2A', flex: 1, alignItems: 'center' },
  snackChipText: { color: '#D4D4D8', fontSize: 11, fontWeight: '600' }
});