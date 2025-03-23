<template>
  <div class="grade-summary">
    <h2>Notenübersicht</h2>
    
    <div class="summary-section">
      <h3>Aktueller Stand</h3>
      <div class="summary-item">
        <span>Bisheriger Schnitt:</span>
        <strong>{{ currentAverage }}</strong>
      </div>
      <div class="summary-item">
        <span>Benotete ECTS:</span>
        <strong>{{ completedGradedCredits }} / {{ totalGradedCredits }}</strong>
      </div>
      <div class="summary-item">
        <span>Alle ECTS:</span>
        <strong>{{ completedCredits }} / {{ totalCredits }}</strong>
      </div>
      <div class="progress-bar">
        <div class="progress" :style="{ width: `${progressPercentage}%` }"></div>
      </div>
      <div class="progress-label">{{ progressPercentage }}% absolviert</div>
    </div>
    
    <div class="summary-section">
      <h3>Voraussichtliche Endnote</h3>
      <div class="final-grade" v-if="hasEnoughData">
        <strong>{{ finalGrade }}</strong>
      </div>
      <div class="info-text" v-else>
        Noch nicht genug Daten für eine valide Prognose.
      </div>
      
      <div class="weight-info">
        <h4>Gewichtung:</h4>
        <ul>
          <li>75% Module, IP & Praxisprojekt</li>
          <li>20% Bachelorarbeit</li>
          <li>5% Kolloquium</li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import { parseGrade } from '../data/studyProgram';

export default {
  name: 'GradeSummary',
  props: {
    grades: {
      type: Object,
      required: true
    },
    studyProgram: {
      type: Object,
      required: true
    }
  },
  computed: {
    // Hilfsfunktion zum Ermitteln aller Module
    allModules() {
      return this.studyProgram.semesters.flatMap(semester => semester.modules);
    },
    
    // Alle benoteten Module
    gradedModules() {
      return this.allModules.filter(module => module.graded);
    },
    
    // Abgelegte Module (mit Note)
    completedGradedModules() {
      return this.gradedModules.filter(module => this.grades[module.name]);
    },
    
    // Gesamtzahl der Credits
    totalCredits() {
      return this.allModules.reduce((sum, module) => sum + module.credits, 0);
    },
    
    // Benotete Credits gesamt
    totalGradedCredits() {
      return this.gradedModules.reduce((sum, module) => sum + module.credits, 0);
    },
    
    // Bereits erworbene Credits
    completedCredits() {
      return this.allModules
        .filter(module => !module.graded || this.grades[module.name])
        .reduce((sum, module) => sum + module.credits, 0);
    },
    
    // Bereits erworbene benotete Credits
    completedGradedCredits() {
      return this.completedGradedModules.reduce((sum, module) => sum + module.credits, 0);
    },
    
    // Fortschritt in Prozent
    progressPercentage() {
      return Math.round((this.completedCredits / this.totalCredits) * 100);
    },
    
    // Aktueller Durchschnitt mit 3 Nachkommastellen
    currentAverage() {
      if (this.completedGradedModules.length === 0) return '-';
      
      let weightedSum = 0;
      let totalCredits = 0;
      
      this.completedGradedModules.forEach(module => {
        const grade = parseGrade(this.grades[module.name]);
        weightedSum += grade * module.credits;
        totalCredits += module.credits;
      });
      
      // Auf exakt 3 Nachkommastellen formatieren
      return (weightedSum / totalCredits).toFixed(3).replace('.', ',');
    },
    
    // Daten für finale Notenberechnung
    finalGradeData() {
      // Finde spezifische wichtige Module
      const thesis = this.allModules.find(m => m.name === "Bachelorarbeit");
      const colloquium = this.allModules.find(m => m.name === "Bachelorkolloquium");
      
      // Prüfe, ob die wichtigen Noten eingetragen wurden
      const hasThesisGrade = thesis && this.grades[thesis.name];
      const hasColloquiumGrade = colloquium && this.grades[colloquium.name];
      
      // Berechne den Durchschnitt der regulären Module (ohne Thesis/Kolloquium)
      const regularModules = this.gradedModules.filter(
        m => m.name !== "Bachelorarbeit" && m.name !== "Bachelorkolloquium"
      );
      
      // Filter nur Module mit Noten
      const completedRegular = regularModules.filter(m => this.grades[m.name]);
      
      let regularAverage = null;
      if (completedRegular.length > 0) {
        let weightedSum = 0;
        let totalCredits = 0;
        
        completedRegular.forEach(module => {
          const grade = parseGrade(this.grades[module.name]);
          weightedSum += grade * module.credits;
          totalCredits += module.credits;
        });
        
        regularAverage = weightedSum / totalCredits;
      }
      
      return {
        regularAverage,
        thesisGrade: hasThesisGrade ? parseGrade(this.grades[thesis.name]) : null,
        colloquiumGrade: hasColloquiumGrade ? parseGrade(this.grades[colloquium.name]) : null,
        hasRegularGrades: completedRegular.length > 0,
        regularModulesPercentage: completedRegular.length / regularModules.length
      };
    },
    
    // Haben wir genug Daten für eine sinnvolle Prognose?
    hasEnoughData() {
      const data = this.finalGradeData;
      // Mindestens 50% der regulären Module sollten benotet sein
      return data.hasRegularGrades && data.regularModulesPercentage >= 0.5;
    },
    
    // Prognostizierte Endnote mit 3 Nachkommastellen
    finalGrade() {
      const data = this.finalGradeData;
      const weights = this.studyProgram.finalGradeWeights;
      
      // Wenn wir Thesis und Kolloquium haben, verwenden wir diese
      // Sonst verwenden wir den Durchschnitt der bisherigen regulären Module als Prognose
      const thesisGrade = data.thesisGrade !== null ? data.thesisGrade : data.regularAverage;
      const colloquiumGrade = data.colloquiumGrade !== null ? data.colloquiumGrade : data.regularAverage;
      
      // Finale gewichtete Berechnung
      const finalGrade = 
        data.regularAverage * weights.regularModules +
        thesisGrade * weights.thesis +
        colloquiumGrade * weights.colloquium;
      
      // Auf exakt 3 Nachkommastellen formatieren
      return finalGrade.toFixed(3).replace('.', ',');
    }
  }
};
</script>

<style scoped>
.grade-summary {
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  padding: 20px;
  position: sticky;
  top: 20px;
  align-self: flex-start; /* Wichtig, damit sticky funktioniert */
  max-height: calc(100vh - 40px); /* Nimmt maximal die Höhe des Viewports minus Padding */
  overflow-y: auto; /* Scrollbar innerhalb der Komponente, falls nötig */
}

h2 {
  margin-top: 0;
  color: #2c3e50;
  border-bottom: 1px solid #eee;
  padding-bottom: 10px;
  margin-bottom: 15px;
}

h3 {
  font-size: 1.1rem;
  margin-top: 0;
  margin-bottom: 15px;
  color: #2c3e50;
}

h4 {
  font-size: 0.95rem;
  margin-top: 15px;
  margin-bottom: 8px;
}

.summary-section {
  margin-bottom: 25px;
  padding-bottom: 20px;
  border-bottom: 1px solid #eee;
}

.summary-section:last-child {
  margin-bottom: 0;
  padding-bottom: 0;
  border-bottom: none;
}

.summary-item {
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
}

.progress-bar {
  height: 8px;
  background-color: #eee;
  border-radius: 4px;
  overflow: hidden;
  margin: 15px 0 5px;
}

.progress {
  height: 100%;
  background-color: #4CAF50;
  border-radius: 4px;
}

.progress-label {
  text-align: center;
  font-size: 0.9em;
  color: #555;
  margin-bottom: 10px;
}

.final-grade {
  font-size: 2rem;
  text-align: center;
  margin: 20px 0;
  color: #2c3e50;
}

.info-text {
  text-align: center;
  color: #666;
  font-style: italic;
  margin: 20px 0;
}

.weight-info ul {
  padding-left: 20px;
  margin: 10px 0;
  color: #555;
  font-size: 0.9em;
}
</style>