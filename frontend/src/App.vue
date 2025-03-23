<template>
  <div id="app">
    <div class="container">
      <header>
        <h1>Notenrechner Informatik B.Sc.</h1>
        <p>Berechne deinen aktuellen Notendurchschnitt und die voraussichtliche Abschlussnote</p>
      </header>

      <div class="grades-container">
        <div class="semesters">
          <SemesterCard 
            v-for="semester in studyProgram.semesters" 
            :key="semester.number"
            :semester="semester"
            :grades="grades"
            @update:grade="updateGrade"
          />
        </div>

        <GradeSummary 
          :grades="grades" 
          :studyProgram="studyProgram" 
        />
      </div>
    </div>
  </div>
</template>

<script>
import { studyProgram } from './data/studyProgram';
import SemesterCard from './components/SemesterCard.vue';
import GradeSummary from './components/GradeSummary.vue';

export default {
  name: 'App',
  components: {
    SemesterCard,
    GradeSummary
  },
  data() {
    return {
      studyProgram,
      grades: {} // Speichert alle Noten in der Form: { "Modulname": "1,7" }
    };
  },
  created() {
    // Versuche gespeicherte Noten aus dem LocalStorage zu laden
    const savedGrades = localStorage.getItem('gradeCalculator');
    if (savedGrades) {
      this.grades = JSON.parse(savedGrades);
    }
  },
  methods: {
    updateGrade(moduleName, grade) {
      // Vue 3 version - keine $set Methode benötigt
      if (!grade) {
        // Wenn grade leer ist, entferne das Modul aus den grades
        delete this.grades[moduleName];
      } else {
        // Sonst setze die Note direkt
        this.grades[moduleName] = grade;
      }
      
      // Speichere Änderungen im LocalStorage
      localStorage.setItem('gradeCalculator', JSON.stringify(this.grades));
    }
  }
};
</script>

<style>
body {
  font-family: 'Roboto', Arial, sans-serif;
  line-height: 1.6;
  margin: 0;
  padding: 0;
  background-color: #f5f7fa;
  color: #333;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

header {
  text-align: center;
  margin-bottom: 30px;
}

h1 {
  color: #2c3e50;
  margin-bottom: 10px;
}

.grades-container {
  display: flex;
  flex-direction: column;
  gap: 30px;
}

@media (min-width: 992px) {
  .grades-container {
    flex-direction: row;
    align-items: flex-start; /* Wichtig für das Sticky-Verhalten */
  }
  
  .semesters {
    flex: 3;
  }
  
  .grades-container > *:last-child {
    flex: 1;
  }
}

.semesters {
  display: flex;
  flex-direction: column;
  gap: 20px;
}
</style>