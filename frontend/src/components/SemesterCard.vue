<template>
  <div class="semester-card">
    <h2>{{ semesterTitle }}</h2>
    
    <div class="modules">
      <ModuleInput 
        v-for="module in semester.modules" 
        :key="module.name"
        :module="module"
        :grade="grades[module.name] || ''"
        :validGrades="validGrades"
        @update:grade="updateGrade"
      />
    </div>

    <div class="semester-summary" v-if="hasGradedModules">
      <div class="summary-item">
        <span>Semesterdurchschnitt:</span>
        <strong>{{ semesterAverage }}</strong>
      </div>
      <div class="summary-item">
        <span>ECTS (benotet/gesamt):</span>
        <strong>{{ gradedCredits }}/{{ totalCredits }}</strong>
      </div>
    </div>
  </div>
</template>

<script>
import ModuleInput from './ModuleInput.vue';
import { studyProgram, parseGrade } from '../data/studyProgram';

export default {
  name: 'SemesterCard',
  components: {
    ModuleInput
  },
  props: {
    semester: {
      type: Object,
      required: true
    },
    grades: {
      type: Object,
      required: true
    }
  },
  computed: {
    semesterTitle() {
      return `${this.semester.number}. Semester`;
    },
    validGrades() {
      return studyProgram.validGrades;
    },
    gradedModules() {
      return this.semester.modules.filter(module => module.graded);
    },
    hasGradedModules() {
      return this.gradedModules.some(module => this.grades[module.name]);
    },
    totalCredits() {
      return this.semester.modules.reduce((sum, module) => sum + module.credits, 0);
    },
    gradedCredits() {
      return this.semester.modules
        .filter(module => module.graded && this.grades[module.name])
        .reduce((sum, module) => sum + module.credits, 0);
    },
    semesterAverage() {
      const gradedModules = this.semester.modules.filter(
        module => module.graded && this.grades[module.name]
      );
      
      if (gradedModules.length === 0) return '-';
      
      let weightedSum = 0;
      let totalCredits = 0;
      
      gradedModules.forEach(module => {
        const grade = parseGrade(this.grades[module.name]);
        weightedSum += grade * module.credits;
        totalCredits += module.credits;
      });
      
      // Auf exakt 3 Nachkommastellen formatieren
      const average = weightedSum / totalCredits;
      return average.toFixed(3).replace('.', ',');
    }
  },
  methods: {
    updateGrade(moduleName, grade) {
      this.$emit('update:grade', moduleName, grade);
    }
  }
};
</script>

<style scoped>
.semester-card {
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  padding: 20px;
  margin-bottom: 15px;
}

h2 {
  margin-top: 0;
  color: #2c3e50;
  border-bottom: 1px solid #eee;
  padding-bottom: 10px;
  margin-bottom: 15px;
}

.modules {
  display: grid;
  gap: 15px;
}

.semester-summary {
  margin-top: 20px;
  padding-top: 15px;
  border-top: 1px solid #eee;
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
}

.summary-item {
  display: flex;
  gap: 10px;
  margin-right: 20px;
}

@media (max-width: 768px) {
  .semester-summary {
    flex-direction: column;
    gap: 10px;
  }
}
</style>