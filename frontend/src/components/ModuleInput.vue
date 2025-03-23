<template>
    <div class="module-input">
      <div class="module-details">
        <div class="module-name">{{ module.name }}</div>
        <div class="module-credits">{{ module.credits }} ECTS</div>
      </div>
      
      <div class="module-grade" v-if="module.graded">
        <select 
          :value="grade" 
          @change="updateGrade($event.target.value)"
          class="grade-select"
        >
          <option value="">Keine Note</option>
          <option v-for="validGrade in validGrades" :key="validGrade" :value="validGrade">
            {{ validGrade }}
          </option>
        </select>
      </div>
      
      <div class="module-grade module-ungraded" v-else>
        Unbenotet
      </div>
    </div>
  </template>
  
  <script>
  export default {
    name: 'ModuleInput',
    props: {
      module: {
        type: Object,
        required: true
      },
      grade: {
        type: String,
        default: ''
      },
      validGrades: {
        type: Array,
        required: true
      }
    },
    methods: {
      updateGrade(value) {
        this.$emit('update:grade', this.module.name, value);
      }
    }
  };
  </script>
  
  <style scoped>
  .module-input {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 10px 0;
    border-bottom: 1px solid #f0f0f0;
  }
  
  .module-input:last-child {
    border-bottom: none;
  }
  
  .module-details {
    flex: 1;
  }
  
  .module-name {
    font-weight: 500;
  }
  
  .module-credits {
    font-size: 0.9em;
    color: #666;
    margin-top: 2px;
  }
  
  .module-grade {
    min-width: 80px;
    text-align: right;
  }
  
  .grade-select {
    padding: 6px 8px;
    border-radius: 4px;
    border: 1px solid #ddd;
    background-color: white;
    font-size: 0.95em;
  }
  
  .module-ungraded {
    color: #888;
    font-style: italic;
  }
  </style>