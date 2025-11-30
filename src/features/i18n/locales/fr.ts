import type { Locale } from './zh';

export const fr: Locale = {
  // App title
  appTitle: 'md2docx',

  // Toolbar
  toolbar: {
    import: 'Importer',
    export: 'Exporter Word',
    copyHtml: 'Copier HTML',
    clear: 'Effacer',
    sample: 'Exemple',
  },

  // Editor
  editor: {
    title: 'Markdown',
    charCount: '{count} caractères',
    placeholder: 'Entrez ou collez du contenu Markdown ici...',
  },

  // Preview
  preview: {
    title: 'Aperçu',
    subtitle: 'LaTeX & Coloration syntaxique',
  },

  // Export dialog
  export: {
    title: "Paramètres d'exportation",
    fileName: 'Nom du fichier',
    fileNamePlaceholder: 'Entrez le nom du fichier',
    pageSize: 'Taille de page',
    cancel: 'Annuler',
    confirm: 'Exporter',
    generating: 'Génération du document Word...',
    success: 'Document exporté avec succès !',
    failed: "Échec de l'exportation",
    noContent: "Veuillez d'abord entrer du contenu",
  },

  // Import
  import: {
    success: 'Chargé : {name}',
    failed: 'Échec de la lecture du fichier',
    invalidType: 'Veuillez sélectionner un fichier Markdown (.md, .markdown, .txt)',
  },

  // File drop zone
  dropZone: {
    message: 'Déposez le fichier Markdown ici',
  },

  // Toast messages
  toast: {
    cleared: 'Contenu effacé',
    sampleLoaded: 'Exemple chargé',
    htmlCopied: 'HTML copié dans le presse-papiers !',
    copyFailed: 'Échec de la copie',
  },

  // Collaboration
  collaboration: {
    title: 'Collaboration',
    yourName: 'Votre nom',
    roomId: 'ID de salle (optionnel)',
    createRoom: 'Créer une salle',
    joinRoom: 'Rejoindre une salle',
    leaveRoom: 'Quitter la salle',
    online: 'En ligne',
    roomCreated: 'Salle créée : {id}',
    roomIdCopied: 'ID de salle copié !',
    leftRoom: 'Vous avez quitté la salle',
    enterName: 'Veuillez entrer votre nom',
    enterRoomId: "Veuillez entrer l'ID de la salle",
    status: {
      connected: 'Connecté',
      connecting: 'Connexion...',
      disconnected: 'Déconnecté',
      error: 'Erreur',
    },
  },

  // Theme
  theme: {
    light: 'Clair',
    dark: 'Sombre',
    switchTo: 'Passer en mode {theme}',
  },

  // Editor toolbar
  editorToolbar: {
    bold: 'Gras',
    italic: 'Italique',
    strikethrough: 'Barré',
    inlineCode: 'Code en ligne',
    link: 'Lien',
    image: 'Image',
    heading1: 'Titre 1',
    heading2: 'Titre 2',
    heading3: 'Titre 3',
    bulletList: 'Liste à puces',
    numberedList: 'Liste numérotée',
    taskList: 'Liste de tâches',
    quote: 'Citation',
    divider: 'Séparateur',
    table: 'Tableau',
    codeBlock: 'Bloc de code',
    math: 'Formule mathématique',
  },
};
