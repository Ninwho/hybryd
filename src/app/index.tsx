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
  // État d'authentification (Mot de passe)
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');

  const [hasStarted, setHasStarted] = useState(false);
  const [activeTab, setActiveTab] = useState('calendar'); 
  const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState(false);
  const [stravaConnected, setStravaConnected] = useState(false);

  // Gestion responsive Web vs Mobile
  const { width } = useWindowDimensions();
  const isDesktop = Platform.OS === 'web' && width > 768;

  // Onboarding & Profil
  const [step, setStep] = useState(1);
  const [userName, setUserName] = useState('Nisrine');
  const [goal, setGoal] = useState('Sèche & Performance Hybride');
  const [gender, setGender] = useState('Femme');
  const [weight, setWeight] = useState('60');
  const [height, setHeight] = useState('168');
  const [age, setAge] = useState('28');
  const [bodyFat, setBodyFat] = useState('22');
  const [muscleMass, setMuscleMass] = useState('44');

  // Planning hebdomadaire sportif
  const [weeklySchedule, setWeeklySchedule] = useState([
    { day: 'Lundi', short: 'L', date: 16, type: 'Rugby / Off', title: '🏉 Entraînement Rugby (Club)', details: '• Séance club haute intensité\n• Focus sur les impacts et courses répétées\n• Récupération nutritionnelle renforcée ce soir' },
    { day: 'Mardi', short: 'M', date: 17, type: 'Renforcement', title: '🏋️‍♂️ Renforcement Haut du Corps', details: '• Développé couché / Tractions\n• Surcharge progressive (Préservation masse musculaire)\n• 4 séries de 6-8 reps' },
    { day: 'Mercredi', short: 'M', date: 18, type: 'Course', title: '🏃‍♂️ Endurance Fondamentale (Zone 2)', details: '• 45 min en aisance respiratoire\n• Cible FC : Zone 2 (65-75% FCmax)\n• Récupération active post-rugby' },
    { day: 'Jeudi', short: 'J', date: 19, type: 'Renforcement', title: '🏋️‍♂️ Renforcement Bas du Corps', details: '• Squat bulgare & Soulevé de terre\n• Focus puissance & explosivité\n• 4 séries de 8 reps' },
    { day: 'Vendredi', short: 'V', date: 20, type: 'Fractionné', title: '⚡️ Running Pro : Fractionné VMA', details: '• Échauffement : 15 min progressif\n• Bloc : 6 x 400m à 100% VMA (1 min trot récup)\n• Retour au calme : 10 min trot lent' },
    { day: 'Samedi', short: 'S', date: 21, type: 'Repos', title: '🛌 Repos Total & Mobilité', details: '• Mobilité articulaire 15 min\n• Étirements doux pour les jambes' },
    { day: 'Dimanche', short: 'D', date: 22, type: 'Sortie Longue', title: '🏃‍♂️ Sortie Longue Hybride', details: '• 60 min en nature (Zone 2 stricte)\n• Construction de l\'endurance aérobie' },
  ]);

  // Course, VMA & PRs
  const [runDistance, setRunDistance] = useState('1.4');
  const [runDuration, setRunDuration] = useState('6');
  const distNum = Number(runDistance) || 1.4;
  const timeNum = Number(runDuration) || 6;
  const estimatedVMA = Math.round((distNum / (timeNum / 60)) * 10) / 10;

  const [pr5k, setPr5k] = useState('23:45');
  const [pr10k, setPr10k] = useState('49:30');
  const [pr21k, setPr21k] = useState('1:52:00');

  const [selectedDayIndex, setSelectedDayIndex] = useState(2);

  // Aliments & Nutrition
  const [selectedFoods, setSelectedFoods] = useState([
    'Poulet', 'Œufs', 'Whey', 'Riz basmati', 'Patates douces', 'Flocons d\'avoine', 'Brocolis', 'Courgettes', 'Avocat', 'Skyr / Fromage blanc', 'Banane'
  ]);
  const [newFoodInput, setNewFoodInput] = useState('');
  const [isRestDaySkipped, setIsRestDaySkipped] = useState(false);
  const [customMealInput, setCustomMealInput] = useState('');
  const [loggedMeals, setLoggedMeals] = useState([
    { name: 'Omelette & Flocons d’avoine', calories: 420, protein: 32 }
  ]);

  // Module SOS Fringale / Snack Coach
  const [snackQuery, setSnackQuery] = useState('');
  const [snackAdvice, setSnackAdvice] = useState('Tape ton envie ci-dessous (ex: "envie de sucre", "gros creux salé") ou sélectionne une option pour obtenir le snack idéal sans impacter ta diète.');

  // Coach Interactif
  const [coachFeedback, setCoachFeedback] = useState('Prête à tout donner ? Ne lâche rien sur tes allures cibles, c\'est la régularité entre le rugby et le bitume qui va faire exploser tes chronos !');
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
    if (q.includes('sucre') || q.includes('chocolat') || q.includes('sucré') || q.includes('dessert')) {
      setSnackAdvice(`🍫 **SOS Sucre pour ${userName}** : Prends 15g de chocolat noir 85% avec une portion de Skyr et quelques fruits rouges. Ça coupe l'envie de sucre net, t'apporte des protéines et reste sous les 160 kcal sans impacter ta sèche !`);
    } else if (q.includes('salé') || q.includes('apéro') || q.includes('croquer') || q.includes('faim')) {
      setSnackAdvice(`🥜 **SOS Salé/Gros Creux pour ${userName}** : Prends une poignée d'amandes (15g) ou quelques bâtonnets de concombre avec un dip de skyr salé aux herbes. Cale l'estomac immédiatement pour ~120 kcal !`);
    } else {
      setSnackAdvice(`💡 **Conseil Fringale Flash** : Pour calmer cette petite faim sans culpabilité, mise sur une portion de Skyr ou 1 œuf dur avec une pincée de sel. Zéro glucide superflu, 100% protéines pour protéger tes muscles !`);
    }
    setSnackQuery('');
  };

  const handleSendCoachMessage = () => {
    if (!userReply.trim()) return;
    const reply = userReply.toLowerCase();
    if (reply.includes('fatigué') || reply.includes('dur') || reply.includes('mal')) {
      setCoachFeedback(`⚠️ Bien reçu ${userName}. Avec le rugby le lundi, ton système nerveux encaisse beaucoup. On reste strictement en Zone 2 cardiaque sur le prochain run pour récupérer sans perdre tes acquis.`);
    } else if (reply.includes('facile') || reply.includes('forme') || reply.includes('top')) {
      setCoachFeedback(`🔥 Énorme ${userName} ! Si les jambes répondent, on va aller gratter des secondes sur ton PR 5k (${pr5k}) dès la prochaine séance de seuil !`);
    } else {
      setCoachFeedback(`💪 Message enregistré ${userName} ! Reste focus sur tes zones cardiaques et tes apports en protéines.`);
    }
    setUserReply('');
  };

  // Calculs physiologiques
  const w = Number(weight) || 60;
  const h = Number(height) || 168;
  const a = Number(age) || 28;
  
  const fcMax = Math.round(208 - (0.7 * a));
  const zone2Min = Math.round(fcMax * 0.65);
  const zone2Max = Math.round(fcMax * 0.75);
  const zone4Max = Math.round(fcMax * 0.92);

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
  
  let targetCalories = Math.round(bmr * 1.55);
  let targetProteinMultiplier = 2.1;

  if (goal === 'Sèche Pure') {
    targetCalories = Math.round((bmr * 1.4) - 350);
    targetProteinMultiplier = 2.4;
  } else if (goal === 'Prise de Masse') {
    targetCalories = Math.round((bmr * 1.6) + 300);
    targetProteinMultiplier = 2.0;
  } else {
    targetCalories = isRestDaySkipped ? Math.round((bmr * 1.4) - 200) : Math.round((bmr * 1.55) - 250);
    targetProteinMultiplier = 2.2;
  }

  const totalConsumedCalories = loggedMeals.reduce((acc, meal) => acc + meal.calories, 1320);
  const totalConsumedProtein = loggedMeals.reduce((acc, meal) => acc + meal.protein, 110);

  const nutrition = {
    targetCalories: targetCalories > 1200 ? targetCalories : 1800,
    consumedCalories: totalConsumedCalories,
    protein: totalConsumedProtein,
    targetProtein: Math.round(w * targetProteinMultiplier),
    carbs: goal === 'Prise de Masse' ? 280 : (isRestDaySkipped ? 120 : 175),
    targetCarbs: goal === 'Prise de Masse' ? 320 : (isRestDaySkipped ? 150 : 210),
    fats: 50,
    targetFats: 65,
  };

  const handleLogCustomMeal = () => {
    if (!customMealInput.trim()) return;
    setLoggedMeals([...loggedMeals, { name: customMealInput, calories: 350, protein: 25 }]);
    setCustomMealInput('');
  };

  // ÉCRAN DE VERROUILLAGE (MOT DE PASSE)
  if (!isAuthenticated) {
    return (
      <View style={styles.authContainer}>
        <View style={styles.authCard}>
          <Text style={styles.authLogo}>⚡️ HYBRYD</Text>
          <Text style={styles.authSubtitle}>Accès privé sécurisé</Text>
          <TextInput 
            secureTextEntry 
            style={styles.input}
            placeholder="Entre ton mot de passe" 
            placeholderTextColor="#666"
            value={passwordInput}
            onChangeText={setPasswordInput}
          />
          <TouchableOpacity 
            style={styles.authButton}
            onPress={() => {
              if (passwordInput === 'TonMotDePasseSecret') { // Change ici par ton mot de passe perso
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

  // 1. Écran de Bienvenue
  if (!hasStarted) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="light-content" />
        <View style={styles.desktopWrapper}>
          <View style={styles.welcomeContainer}>
            <View style={styles.welcomeContent}>
              <Text style={styles.welcomeLogo}>⚡️ HYBRYD ⚡️</Text>
              <Text style={styles.welcomeTagline}>Ton coach d'élite personnel</Text>
              <Text style={styles.welcomeDescription}>
                La fusion parfaite entre exigence sportive (rugby, course type Runna, renfo) et nutrition de précision.
              </Text>
            </View>
            <TouchableOpacity 
              style={styles.startButtonLarge}
              onPress={() => setHasStarted(true)}
            >
              <Text style={styles.startButtonLargeText}>Commencer</Text>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    );
  }

  // 2. Questionnaire d'Onboarding (6 étapes)
  if (!hasCompletedOnboarding) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="light-content" />
        <View style={styles.desktopWrapper}>
          <View style={styles.onboardingContainer}>
            <Text style={styles.onboardingStepTitle}>🧠 Étape {step}/6 : Configuration de Hybryd</Text>
            
            {step === 1 && (
              <ScrollView contentContainerStyle={{ paddingVertical: 10 }} showsVerticalScrollIndicator={false}>
                <Text style={styles.questionText}>Comment t'appelles-tu ?</Text>
                <Text style={styles.subtext}>Ton coach s'adressera directement à toi.</Text>
                <TextInput style={styles.input} value={userName} onChangeText={setUserName} placeholder="Ex: Nisrine" placeholderTextColor="#666" />
                
                <Text style={[styles.questionText, { marginTop: 20 }]}>Quel est ton objectif principal ?</Text>
                {[
                  'Sèche & Performance Hybride',
                  'Sèche Pure',
                  'Prise de Masse'
                ].map((item) => (
                  <TouchableOpacity 
                    key={item} 
                    style={[styles.optionButton, goal === item && styles.optionSelected]}
                    onPress={() => setGoal(item)}
                  >
                    <Text style={styles.optionText}>{item}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            )}

            {step === 2 && (
              <ScrollView contentContainerStyle={{ paddingVertical: 10 }} showsVerticalScrollIndicator={false}>
                <Text style={styles.questionText}>Profil & Mensurations</Text>
                <Text style={styles.subtext}>Indispensable pour calibrer tes zones cardiaques et ton métabolisme.</Text>
                
                <Text style={styles.labelInput}>Sexe</Text>
                <View style={styles.genderRow}>
                  {['Femme', 'Homme'].map((g) => (
                    <TouchableOpacity
                      key={g}
                      style={[styles.genderButton, gender === g && styles.optionSelected]}
                      onPress={() => setGender(g)}
                    >
                      <Text style={styles.optionText}>{g === 'Femme' ? '👩 Femme' : '👨 Homme'}</Text>
                    </TouchableOpacity>
                  ))}
                </View>

                <Text style={styles.labelInput}>Poids actuel (kg)</Text>
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
                <Text style={styles.subtext}>Pour préserver ou construire du muscle efficacement.</Text>
                
                <Text style={styles.labelInput}>Masse grasse (%)</Text>
                <TextInput style={styles.input} value={bodyFat} onChangeText={setBodyFat} keyboardType="numeric" placeholder="Ex: 22" placeholderTextColor="#666" />

                <Text style={styles.labelInput}>Masse musculaire (kg)</Text>
                <TextInput style={styles.input} value={muscleMass} onChangeText={setMuscleMass} keyboardType="numeric" placeholder="Ex: 44" placeholderTextColor="#666" />
              </ScrollView>
            )}

            {step === 4 && (
              <View style={{ flex: 1, justifyContent: 'center' }}>
                <Text style={styles.questionText}>Ton Planning Hebdomadaire Type</Text>
                <Text style={styles.subtext}>
                  Intégration de ton rugby le lundi, de tes séances de renfo et de ton running pro type Runna.
                </Text>
                <View style={{ backgroundColor: '#181614', padding: 16, borderRadius: 12, borderWidth: 1, borderColor: '#262320' }}>
                  <Text style={{ color: '#E5A96E', fontWeight: 'bold', marginBottom: 6 }}>📅 Semaine type active :</Text>
                  <Text style={{ color: '#D4D4D8', fontSize: 13, lineHeight: 20 }}>
                    • Lundi : Rugby (Club){'\n'}
                    • Mardi & Jeudi : Renforcement Musculaire{'\n'}
                    • Mercredi : Endurance (Zone 2){'\n'}
                    • Vendredi : Fractionné VMA (Façon Runna){'\n'}
                    • Samedi : Repos & Mobilité{'\n'}
                    • Dimanche : Sortie Longue
                  </Text>
                </View>
              </View>
            )}

            {step === 5 && (
              <View style={{ flex: 1 }}>
                <Text style={styles.questionText}>Coche tes aliments favoris</Text>
                <Text style={styles.subtextSmall}>
                  Sélectionnés : {selectedFoods.length} aliment(s). Ton programme intègre tes choix.
                </Text>
                
                <ScrollView style={styles.foodScroll} showsVerticalScrollIndicator={false}>
                  {INITIAL_FOOD_CATEGORIES.map((category) => (
                    <View key={category.title} style={styles.categoryBlock}>
                      <Text style={styles.categoryTitle}>{category.title}</Text>
                      <View style={styles.chipsContainer}>
                        {category.items.map((food) => {
                          const isSelected = selectedFoods.includes(food);
                          return (
                            <TouchableOpacity
                              key={food}
                              style={[styles.foodChip, isSelected && styles.foodChipSelected]}
                              onPress={() => toggleFood(food)}
                            >
                              <Text style={[styles.foodChipText, isSelected && styles.foodChipTextSelected]}>
                                {isSelected ? `✓ ${food}` : food}
                              </Text>
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
                <Text style={styles.questionText}>Évaluation de course (VMA & PR)</Text>
                <Text style={styles.subtext}>Entre ta distance et ton temps pour calibrer tes allures d'entraînement.</Text>

                <Text style={styles.labelInput}>Distance parcourue (en km)</Text>
                <TextInput style={styles.input} value={runDistance} onChangeText={setRunDistance} keyboardType="numeric" placeholder="Ex: 1.4" placeholderTextColor="#666" />

                <Text style={styles.labelInput}>Temps réalisé (en minutes)</Text>
                <TextInput style={styles.input} value={runDuration} onChangeText={setRunDuration} keyboardType="numeric" placeholder="Ex: 6" placeholderTextColor="#666" />

                <View style={styles.vmaResultCard}>
                  <Text style={styles.vmaResultTitle}>⚡️ VMA Estimée</Text>
                  <Text style={styles.vmaResultValue}>{estimatedVMA} km/h</Text>
                  <Text style={styles.vmaResultSub}>FC Max estimée : {fcMax} bpm • Basé sur {runDistance} km en {runDuration} min.</Text>
                </View>
              </ScrollView>
            )}

            <View style={styles.onboardingFooter}>
              {step > 1 && (
                <TouchableOpacity style={styles.backButton} onPress={() => setStep(step - 1)}>
                  <Text style={styles.backButtonText}>Retour</Text>
                </TouchableOpacity>
              )}
              <TouchableOpacity 
                style={[styles.nextButton, step > 1 && { flex: 1, marginLeft: 10 }]}
                onPress={() => {
                  if (step < 6) setStep(step + 1);
                  else setHasCompletedOnboarding(true);
                }}
              >
                <Text style={styles.nextButtonText}>{step === 6 ? "Lancer Hybryd 🚀" : "Suivant"}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </SafeAreaView>
    );
  }

  // 3. Application Principale (Responsive Web/Desktop card & Mobile full)
  const currentDayData = weeklySchedule[selectedDayIndex];

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      
      <View style={[styles.desktopWrapper, isDesktop && styles.desktopCardLayout]}>
        
        {/* En-tête personnalisé */}
        <View style={styles.header}>
          <Text style={styles.title}>⚡️ HYBRYD</Text>
          <Text style={styles.subtitle}>Coach de {userName} • {weight}kg • {goal}</Text>
        </View>

        <ScrollView contentContainerStyle={styles.scrollContent}>
          
          {/* ONGLET 1 : CALENDRIER */}
          {activeTab === 'calendar' && (
            <View>
              <View style={styles.calendarHeaderContainer}>
                <Text style={styles.calendarMainTitle}>SALUT {userName.toUpperCase()} 👋</Text>
                <Text style={styles.calendarSubTitle}>Ton calendrier sportif et tes charges d'entraînement</Text>
              </View>

              {/* Encadré Coach Interactif */}
              <View style={styles.aiCard}>
                <Text style={styles.aiTitle}>🤖 Le Briefing du Coach</Text>
                <Text style={styles.aiText}>{coachFeedback}</Text>

                <View style={{ marginTop: 12 }}>
                  <TextInput
                    style={styles.inputMeal}
                    value={userReply}
                    onChangeText={setUserReply}
                    placeholder="Réponds au coach (ex: Fatiguée, ou super en forme !)"
                    placeholderTextColor="#666"
                  />
                  <TouchableOpacity style={styles.logMealButton} onPress={handleSendCoachMessage}>
                    <Text style={styles.logMealButtonText}>Envoyer mon ressenti au coach</Text>
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
                <Text style={styles.selectedDayMeta}>Optimisé pour tes performances et ton rugby</Text>
                
                <View style={styles.workoutDetailsBox}>
                  <Text style={styles.workoutDetailsText}>{currentDayData.details}</Text>
                </View>

                <TouchableOpacity style={styles.seeWorkoutButton}>
                  <Text style={styles.seeWorkoutButtonText}>Lancer la séance interactive →</Text>
                </TouchableOpacity>
              </View>

              <View style={styles.section}>
                <TouchableOpacity 
                  style={[styles.skipButton, isRestDaySkipped && styles.skipButtonActive]}
                  onPress={() => setIsRestDaySkipped(!isRestDaySkipped)}
                >
                  <Text style={styles.skipButtonText}>
                    {isRestDaySkipped ? "🔄 Annuler le repos (Réactiver la séance)" : "🛌 Skip la séance de ce jour (Off forcé)"}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          )}

          {/* ONGLET 2 : MUSCU */}
          {activeTab === 'muscu' && (
            <View>
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>🏋️‍♂️ Renforcement & Hypertrophie</Text>
                <View style={styles.workoutCard}>
                  <Text style={styles.workoutType}>Stratégie Musculaire pour {userName}</Text>
                  <Text style={styles.workoutDetails}>• Mardi & Jeudi : Séances de renforcement conçues pour compléter ton rugby du lundi sans saturer ton système nerveux.</Text>
                  <Text style={styles.workoutDetails}>• Focus : Maintien et densification de tes {muscleMass}kg de muscle pendant ta période de {goal.toLowerCase()}.</Text>
                </View>
              </View>
            </View>
          )}

          {/* ONGLET 3 : COURSE */}
          {activeTab === 'course' && (
            <View>
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>🏃‍♂️ Module Running Pro (Façon Runna)</Text>
                
                <View style={styles.aiCard}>
                  <Text style={styles.aiTitle}>⚡️ Allures & Zones FC de {userName}</Text>
                  <Text style={styles.aiText}>
                    VMA : <Text style={{ color: '#E5A96E', fontWeight: 'bold' }}>{estimatedVMA} km/h</Text> • FC Max estimée : <Text style={{ color: '#E5A96E', fontWeight: 'bold' }}>{fcMax} bpm</Text>
                  </Text>
                  
                  <View style={{ marginTop: 10 }}>
                    <Text style={styles.workoutDetails}>• Endurance Fondamentale (Z2) : {paceEF} /km</Text>
                    <Text style={styles.workoutDetails}>• Allure Seuil / Tempo (Z4) : {paceSeuil} /km</Text>
                    <Text style={styles.workoutDetails}>• Allure Fractionné Court (VMA) : {paceVMA} /km</Text>
                  </View>
                </View>

                <View style={styles.workoutCard}>
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                    <Text style={styles.workoutType}>🏆 Tes Records Personnels (PR)</Text>
                    <TouchableOpacity 
                      style={[styles.stravaBadge, stravaConnected && { backgroundColor: '#064E3B' }]}
                      onPress={() => setStravaConnected(!stravaConnected)}
                    >
                      <Text style={{ color: '#FFFFFF', fontSize: 11, fontWeight: 'bold' }}>
                        {stravaConnected ? '✅ Sync Strava' : '🟠 Lier Strava'}
                      </Text>
                    </TouchableOpacity>
                  </View>

                  <View style={styles.prRow}>
                    <View style={styles.prBox}>
                      <Text style={styles.prLabel}>5 KM</Text>
                      <TextInput style={styles.prInput} value={pr5k} onChangeText={setPr5k} />
                    </View>
                    <View style={styles.prBox}>
                      <Text style={styles.prLabel}>10 KM</Text>
                      <TextInput style={styles.prInput} value={pr10k} onChangeText={setPr10k} />
                    </View>
                    <View style={styles.prBox}>
                      <Text style={styles.prLabel}>SEMI (21.1K)</Text>
                      <TextInput style={styles.prInput} value={pr21k} onChangeText={setPr21k} />
                    </View>
                  </View>
                </View>
              </View>
            </View>
          )}

          {/* ONGLET 4 : NUTRITION */}
          {activeTab === 'nutrition' && (
            <View>
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>🍎 Suivi Nutritionnel & {goal}</Text>
                
                <View style={styles.macroCard}>
                  <Text style={styles.macroMainTitle}>Objectif Calorique de {userName}</Text>
                  <Text style={styles.macroBigNumber}>{nutrition.consumedCalories} / {nutrition.targetCalories} kcal</Text>
                  <Text style={styles.macroSub}>
                    {goal === 'Prise de Masse' 
                      ? 'Surplus calorique actif pour croître.' 
                      : (nutrition.targetCalories - nutrition.consumedCalories >= 0 
                          ? `Il te reste ${nutrition.targetCalories - nutrition.consumedCalories} kcal.`
                          : `⚠️ Dépassement de ${Math.abs(nutrition.targetCalories - nutrition.consumedCalories)} kcal.`)}
                  </Text>
                </View>

                <View style={styles.macrosRow}>
                  <View style={styles.macroBox}>
                    <Text style={styles.macroLabel}>Protéines</Text>
                    <Text style={styles.macroValue}>{nutrition.protein}g / {nutrition.targetProtein}g</Text>
                  </View>
                  <View style={styles.macroBox}>
                    <Text style={styles.macroLabel}>Glucides</Text>
                    <Text style={styles.macroValue}>{nutrition.carbs}g / {nutrition.targetCarbs}g</Text>
                  </View>
                  <View style={styles.macroBox}>
                    <Text style={styles.macroLabel}>Lipides</Text>
                    <Text style={styles.macroValue}>{nutrition.fats}g / {nutrition.targetFats}g</Text>
                  </View>
                </View>

                {/* MODULE SOS FRINGALE / SNACK */}
                <View style={styles.mealInputCard}>
                  <Text style={styles.mealInputTitle}>🚨 SOS Fringale & Snack Coach</Text>
                  <Text style={styles.subtextSmall}>Une envie de sucre ou de salé ? Demande conseil au coach pour ne pas ruiner ta diète.</Text>
                  
                  <View style={{ backgroundColor: '#201D1A', padding: 12, borderRadius: 10, marginBottom: 12, borderWidth: 1, borderColor: '#332E2A' }}>
                    <Text style={{ color: '#E2E8F0', fontSize: 13, lineHeight: 18 }}>{snackAdvice}</Text>
                  </View>

                  <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 }}>
                    <TouchableOpacity style={styles.snackChip} onPress={() => handleGetSnackAdvice('sucre')}>
                      <Text style={styles.snackChipText}>🍫 Envie de sucre</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.snackChip} onPress={() => handleGetSnackAdvice('salé')}>
                      <Text style={styles.snackChipText}>🥜 Envie de salé</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.snackChip} onPress={() => handleGetSnackAdvice('faim')}>
                      <Text style={styles.snackChipText}>🍽️ Gros creux</Text>
                    </TouchableOpacity>
                  </View>

                  <TextInput
                    style={styles.inputMeal}
                    value={snackQuery}
                    onChangeText={setSnackQuery}
                    placeholder="Ex: Qu'est-ce que je peux manger ce soir ?"
                    placeholderTextColor="#666"
                  />
                  <TouchableOpacity style={styles.logMealButton} onPress={() => handleGetSnackAdvice(snackQuery)}>
                    <Text style={styles.logMealButtonText}>Demander mon option snack anti-culpabilité</Text>
                  </TouchableOpacity>
                </View>

                {/* Ajout rapide d'aliments */}
                <View style={styles.mealInputCard}>
                  <Text style={styles.mealInputTitle}>🥑 Ajouter un aliment fétiche (Tac au tac)</Text>
                  <TextInput
                    style={styles.inputMeal}
                    value={newFoodInput}
                    onChangeText={setNewFoodInput}
                    placeholder="Ex: Beurre de cacahuète, pain complet..."
                    placeholderTextColor="#666"
                  />
                  <TouchableOpacity style={styles.logMealButton} onPress={handleAddQuickFood}>
                    <Text style={styles.logMealButtonText}>+ Enregistrer dans mes habitudes</Text>
                  </TouchableOpacity>

                  <View style={{ marginTop: 12 }}>
                    <Text style={{ color: '#94A3B8', fontSize: 12, marginBottom: 6, fontWeight: '600' }}>Tes aliments actifs ({selectedFoods.length}) :</Text>
                    <Text style={{ color: '#E5A96E', fontSize: 13, lineHeight: 18 }}>
                      {selectedFoods.join(', ')}
                    </Text>
                  </View>
                </View>

                {/* Analyse plat libre */}
                <View style={styles.mealInputCard}>
                  <Text style={styles.mealInputTitle}>🤖 Entrer un plat pour analyse</Text>
                  <TextInput
                    style={styles.inputMeal}
                    value={customMealInput}
                    onChangeText={setCustomMealInput}
                    placeholder="Ex: Salade de thon, avocat, pain..."
                    placeholderTextColor="#666"
                  />
                  <TouchableOpacity style={styles.logMealButton} onPress={handleLogCustomMeal}>
                    <Text style={styles.logMealButtonText}>Calculer & Ajouter au journal</Text>
                  </TouchableOpacity>

                  <View style={{ marginTop: 14 }}>
                    <Text style={{ color: '#94A3B8', fontSize: 13, marginBottom: 6, fontWeight: '600' }}>Repas du jour :</Text>
                    {loggedMeals.map((meal, index) => (
                      <View key={index} style={styles.loggedMealItem}>
                        <Text style={{ color: '#FFFFFF', fontSize: 14 }}>• {meal.name}</Text>
                        <Text style={{ color: '#E5A96E', fontSize: 13, fontWeight: '600' }}>{meal.calories} kcal ({meal.protein}g P)</Text>
                      </View>
                    ))}
                  </View>
                </View>

                {/* Recettes personnalisées */}
                <Text style={[styles.sectionTitle, { marginTop: 10, marginBottom: 14 }]}>🧑‍🍳 Idées de Recettes pour {userName}</Text>

                <View style={styles.recipeCard}>
                  <Text style={styles.recipeMealType}>🍳 Petit-déjeuner</Text>
                  <Text style={styles.recipeTitle}>Bowl Flocons d'avoine, Whey & {selectedFoods[selectedFoods.length - 1] || 'Banane'}</Text>
                  <Text style={styles.recipeDetails}>• Cadré pour tes besoins en protéines du matin ({nutrition.targetProtein}g visés)\n• Apports : ~380 kcal | 30g Protéines</Text>
                </View>

                <View style={styles.recipeCard}>
                  <Text style={styles.recipeMealType}>🥗 Déjeuner / Dîner</Text>
                  <Text style={styles.recipeTitle}>Assiette sur-mesure : {selectedFoods[0] || 'Poulet'} & {selectedFoods[1] || 'Riz basmati'}</Text>
                  <Text style={styles.recipeDetails}>• Basé sur tes favoris enregistrés.\n• Apports : ~500 kcal | 42g Protéines</Text>
                </View>

              </View>
            </View>
          )}

        </ScrollView>

        {/* Barre de navigation */}
        <View style={styles.navBar}>
          <TouchableOpacity style={styles.navItem} onPress={() => setActiveTab('calendar')}>
            <Text style={[styles.navText, activeTab === 'calendar' && styles.navTextActive]}>📅 Calendrier</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.navItem} onPress={() => setActiveTab('muscu')}>
            <Text style={[styles.navText, activeTab === 'muscu' && styles.navTextActive]}>🏋️‍♂️ Muscu</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.navItem} onPress={() => setActiveTab('course')}>
            <Text style={[styles.navText, activeTab === 'course' && styles.navTextActive]}>🏃‍♂️ Course</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.navItem} onPress={() => setActiveTab('nutrition')}>
            <Text style={[styles.navText, activeTab === 'nutrition' && styles.navTextActive]}>🥗 Nutrition</Text>
          </TouchableOpacity>
        </View>

      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0A0908' },
  
  // Styles pour la version Desktop/Web (Effet Card centrée façon Web App moderne)
  desktopWrapper: { flex: 1, width: '100%', maxWidth: '100%' },
  desktopCardLayout: {
    maxWidth: 480,
    alignSelf: 'center',
    marginVertical: Platform.OS === 'web' ? 20 : 0,
    borderRadius: 24,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#262320',
    boxShadow: '0px 10px 30px rgba(0, 0, 0, 0.8)',
    height: Platform.OS === 'web' ? '90vh' : '100%'
  },

  authContainer: { flex: 1, backgroundColor: '#0F0E0D', justifyContent: 'center', alignItems: 'center', padding: 20 },
  authCard: { width: '100%', maxWidth: 400, backgroundColor: '#181614', padding: 24, borderRadius: 16, borderWidth: 1, borderColor: '#262320', alignItems: 'center' },
  authLogo: { fontSize: 28, fontWeight: 'bold', color: '#E5A96E', letterSpacing: 2, marginBottom: 6 },
  authSubtitle: { fontSize: 14, color: '#A1A1AA', marginBottom: 20 },
  authButton: { backgroundColor: '#E5A96E', width: '100%', padding: 14, borderRadius: 10, alignItems: 'center', marginTop: 10 },
  authButtonText: { color: '#0F0E0D', fontWeight: 'bold', fontSize: 15 },

  welcomeContainer: { flex: 1, justifyContent: 'space-between', padding: 24, alignItems: 'center' },
  welcomeContent: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  welcomeLogo: { fontSize: 36, fontWeight: 'bold', color: '#E5A96E', letterSpacing: 2, marginBottom: 10 },
  welcomeTagline: { fontSize: 18, color: '#FFFFFF', fontWeight: '600', marginBottom: 20 },
  welcomeDescription: { fontSize: 15, color: '#A1A1AA', textAlign: 'center', lineHeight: 22, paddingHorizontal: 10 },
  startButtonLarge: { backgroundColor: '#E5A96E', width: '100%', padding: 16, borderRadius: 12, alignItems: 'center', marginBottom: 20 },
  startButtonLargeText: { color: '#0F0E0D', fontWeight: 'bold', fontSize: 16 },
  
  header: { padding: 20, backgroundColor: '#181614', borderBottomWidth: 1, borderBottomColor: '#262320' },
  title: { fontSize: 22, fontWeight: 'bold', color: '#E5A96E', letterSpacing: 1 },
  subtitle: { fontSize: 13, color: '#A1A1AA', marginTop: 4 },
  scrollContent: { padding: 20, paddingBottom: 100 },

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
  
  stravaBadge: { backgroundColor: '#FC4C02', paddingHorizontal: 10, paddingVertical: 5, borderRadius: 8 },
  prRow: { flexDirection: 'row', justifyContent: 'space-between' },
  prBox: { flex: 1, backgroundColor: '#201D1A', padding: 10, borderRadius: 10, marginHorizontal: 4, alignItems: 'center', borderWidth: 1, borderColor: '#262320' },
  prLabel: { fontSize: 11, color: '#E5A96E', fontWeight: 'bold', marginBottom: 4 },
  prInput: { color: '#FFFFFF', fontSize: 15, fontWeight: 'bold', textAlign: 'center', width: '100%' },

  navBar: { flexDirection: 'row', backgroundColor: '#181614', borderTopWidth: 1, borderTopColor: '#262320', position: 'absolute', bottom: 0, left: 0, right: 0, paddingBottom: 10, paddingTop: 10 },
  navItem: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  navText: { color: '#78716C', fontWeight: '600', fontSize: 12 },
  navTextActive: { color: '#E5A96E', fontWeight: 'bold' },
  
  onboardingContainer: { flex: 1, padding: 24, justifyContent: 'space-between' },
  onboardingStepTitle: { fontSize: 16, color: '#E5A96E', fontWeight: 'bold', marginBottom: 12 },
  questionText: { fontSize: 22, color: '#FFFFFF', fontWeight: 'bold', marginBottom: 12, lineHeight: 28 },
  subtext: { fontSize: 15, color: '#A1A1AA', lineHeight: 22, marginBottom: 20 },
  subtextSmall: { fontSize: 13, color: '#E5A96E', marginBottom: 12 },
  optionButton: { backgroundColor: '#181614', padding: 16, borderRadius: 12, marginBottom: 12, borderWidth: 1, borderColor: '#262320' },
  optionSelected: { borderColor: '#E5A96E', backgroundColor: '#262320' },
  optionText: { color: '#FFFFFF', fontSize: 16, fontWeight: '600', textAlign: 'center' },
  
  genderRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 16 },
  genderButton: { flex: 1, backgroundColor: '#181614', padding: 14, borderRadius: 12, borderWidth: 1, borderColor: '#262320', marginHorizontal: 4 },

  labelInput: { color: '#A1A1AA', fontSize: 14, fontWeight: '600', marginBottom: 6 },
  input: { backgroundColor: '#181614', color: '#FFFFFF', padding: 14, borderRadius: 12, fontSize: 16, borderWidth: 1, borderColor: '#262320', marginBottom: 16 },

  vmaResultCard: { backgroundColor: '#181614', borderRadius: 12, padding: 16, marginTop: 6, marginBottom: 10, borderWidth: 1, borderColor: '#E5A96E', alignItems: 'center' },
  vmaResultTitle: { fontSize: 14, color: '#A1A1AA', marginBottom: 4 },
  vmaResultValue: { fontSize: 26, fontWeight: 'bold', color: '#FFFFFF', marginBottom: 4 },
  vmaResultSub: { fontSize: 12, color: '#E5A96E' },

  foodScroll: { flex: 1, marginBottom: 10 },
  categoryBlock: { marginBottom: 20 },
  categoryTitle: { fontSize: 16, fontWeight: 'bold', color: '#FFFFFF', marginBottom: 10 },
  chipsContainer: { flexDirection: 'row', flexWrap: 'wrap' },
  foodChip: { backgroundColor: '#181614', paddingVertical: 8, paddingHorizontal: 14, borderRadius: 20, borderWidth: 1, borderColor: '#262320', marginBottom: 8, marginRight: 8 },
  foodChipSelected: { backgroundColor: '#201D1A', borderColor: '#E5A96E' },
  foodChipText: { color: '#A1A1AA', fontSize: 14, fontWeight: '500' },
  foodChipTextSelected: { color: '#FFFFFF', fontWeight: 'bold' },

  onboardingFooter: { flexDirection: 'row', paddingTop: 10 },
  backButton: { backgroundColor: '#262320', padding: 16, borderRadius: 12, alignItems: 'center', paddingHorizontal: 20 },
  backButtonText: { color: '#FFFFFF', fontWeight: 'bold', fontSize: 16 },
  nextButton: { flex: 1, backgroundColor: '#E5A96E', padding: 16, borderRadius: 12, alignItems: 'center' },
  nextButtonText: { color: '#0F0E0D', fontWeight: 'bold', fontSize: 16 },

  macroCard: { backgroundColor: '#181614', borderRadius: 12, padding: 16, marginBottom: 14, borderWidth: 1, borderColor: '#262320', alignItems: 'center' },
  macroMainTitle: { fontSize: 14, color: '#A1A1AA', marginBottom: 6 },
  macroBigNumber: { fontSize: 26, fontWeight: 'bold', color: '#FFFFFF', marginBottom: 4 },
  macroSub: { fontSize: 13, color: '#E5A96E' },
  macrosRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20 },
  macroBox: { flex: 1, backgroundColor: '#181614', padding: 12, borderRadius: 10, marginHorizontal: 4, alignItems: 'center', borderWidth: 1, borderColor: '#262320' },
  macroLabel: { fontSize: 12, color: '#A1A1AA', marginBottom: 4 },
  macroValue: { fontSize: 14, fontWeight: 'bold', color: '#FFFFFF' },

  mealInputCard: { backgroundColor: '#181614', borderRadius: 12, padding: 16, marginBottom: 20, borderWidth: 1, borderColor: '#262320' },
  mealInputTitle: { fontSize: 16, fontWeight: 'bold', color: '#E5A96E', marginBottom: 6 },
  inputMeal: { backgroundColor: '#201D1A', color: '#FFFFFF', padding: 12, borderRadius: 10, fontSize: 15, borderWidth: 1, borderColor: '#262320', marginBottom: 10 },
  logMealButton: { backgroundColor: '#E5A96E', padding: 10, borderRadius: 8, alignItems: 'center' },
  logMealButtonText: { color: '#0F0E0D', fontWeight: 'bold', fontSize: 13 },
  loggedMealItem: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 4, borderBottomWidth: 1, borderBottomColor: '#262320' },

  snackChip: { backgroundColor: '#201D1A', paddingVertical: 8, paddingHorizontal: 10, borderRadius: 8, borderWidth: 1, borderColor: '#332E2A', flex: 1, marginHorizontal: 3, alignItems: 'center' },
  snackChipText: { color: '#D4D4D8', fontSize: 11, fontWeight: '600' },

  recipeCard: { backgroundColor: '#181614', borderRadius: 12, padding: 14, marginBottom: 12, borderWidth: 1, borderColor: '#262320' },
  recipeMealType: { fontSize: 12, color: '#E5A96E', fontWeight: '700', textTransform: 'uppercase', marginBottom: 4 },
  recipeTitle: { fontSize: 15, fontWeight: 'bold', color: '#FFFFFF', marginBottom: 4 },
  recipeDetails: { fontSize: 13, color: '#A1A1AA', lineHeight: 18 }
});