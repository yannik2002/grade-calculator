// src/data/studyProgram.js

export const studyProgram = {
    semesters: [
      {
        number: 1,
        modules: [
          { name: "Höhere Mathematik 1", credits: 9, graded: true },
          { name: "Grundlagen der Informatik und höhere Programmiersprache", credits: 10, graded: true },
          { name: "Technische Informatik", credits: 8, graded: true },
          { name: "Softskill", credits: 2, graded: false }
        ]
      },
      {
        number: 2,
        modules: [
          { name: "Höhere Mathematik 2 für Informatik", credits: 6, graded: true },
          { name: "Datennetze und IT-Sicherheit", credits: 8, graded: true },
          { name: "Algorithmen und Datenstrukturen", credits: 8, graded: true },
          { name: "Theoretische Informatik und Logik", credits: 7, graded: true },
          { name: "Softskill", credits: 2, graded: false }
        ]
      },
      {
        number: 3,
        modules: [
          { name: "Datenbanken und Webtechnologien", credits: 8, graded: true },
          { name: "Architektur von Rechnersystemen, Betriebssysteme und verteilte Systeme", credits: 8, graded: true },
          { name: "Software Engineering", credits: 5, graded: true },
          { name: "Objektorientierte Softwareentwicklung", credits: 5, graded: true },
          { name: "BWL", credits: 4, graded: true }
        ]
      },
      {
        number: 4,
        modules: [
          { name: "Wahlmodul 1", credits: 6, graded: true },
          { name: "Wahlmodul 2", credits: 6, graded: true },
          { name: "Wahlmodul 3", credits: 6, graded: true },
          { name: "Wahlmodul 4", credits: 6, graded: true },
          { name: "Wahlmodul 5", credits: 6, graded: true }
        ]
      },
      {
        number: 5,
        modules: [
          { name: "Wahlmodul 6", credits: 6, graded: true },
          { name: "Wahlmodul 7", credits: 6, graded: true },
          { name: "Wahlmodul 8", credits: 6, graded: true },
          { name: "Wahlmodul 9", credits: 6, graded: true },
          { name: "Interdisziplinäres Projekt", credits: 6, graded: true }
        ]
      },
      {
        number: 6,
        modules: [
          { name: "Praxisprojekt", credits: 15, graded: true },
          { name: "Bachelorarbeit", credits: 12, graded: true },
          { name: "Bachelorkolloquium", credits: 3, graded: true }
        ]
      }
    ],
    
    // Gültige Notenwerte für die Auswahl
    validGrades: [
      "1,0", "1,3", "1,7", 
      "2,0", "2,3", "2,7", 
      "3,0", "3,3", "3,7", 
      "4,0"
    ],
    
    // Gewichtung für die Endnote
    finalGradeWeights: {
      regularModules: 0.75, // 75% für alle Module inkl. Interdisziplinäres Projekt und Praxisprojekt
      thesis: 0.20,         // 20% für die Bachelorarbeit
      colloquium: 0.05      // 5% für das Kolloquium
    }
  };
  
  // Hilfsfunktion zur Umrechnung einer Note-String in Number (Komma zu Punkt)
  export function parseGrade(gradeStr) {
    if (!gradeStr) return null;
    return parseFloat(gradeStr.replace(',', '.'));
  }
  
  // Hilfsfunktion zur Formatierung einer Number als Note-String (Punkt zu Komma)
  export function formatGrade(gradeNum) {
    if (gradeNum === null || gradeNum === undefined) return '';
    return gradeNum.toFixed(1).replace('.', ',');
  }