import { Injectable } from '@angular/core';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';

//Fournir une API unifiée pour afficher des notifications visuelles (snackbars) dans toute l’application, via Angular Material.
/**
 * Service de notification centralisé utilisant MatSnackBar
 * Fournit des méthodes pratiques pour différents types de messages
 */
@Injectable({
  providedIn: 'root' //Ce service est disponible partout dans ton app
})
export class NotificationService {
  private readonly defaultConfig: MatSnackBarConfig = {
    duration: 3000,
    horizontalPosition: 'end',
    verticalPosition: 'top'
  };

  constructor(private snackBar: MatSnackBar) {}

  /**
   * Affiche une notification de succès
   * @param message Le message à afficher
   * @param config Configuration optionnelle
   */
  showSuccess(message: string, config?: MatSnackBarConfig): void {
    this.snackBar.open(message, 'Fermer', {
      ...this.defaultConfig,
      ...config,
      panelClass: ['success-snackbar']
    });
  }

  /**
   * Affiche une notification d'erreur
   * @param message Le message à afficher
   * @param config Configuration optionnelle
   */
  showError(message: string, config?: MatSnackBarConfig): void {
    this.snackBar.open(message, 'Fermer', {
      ...this.defaultConfig,
      ...config,
      panelClass: ['error-snackbar']
    });
  }

  /**
   * Affiche une notification d'avertissement
   * @param message Le message à afficher
   * @param config Configuration optionnelle
   */
  showWarning(message: string, config?: MatSnackBarConfig): void {
    this.snackBar.open(message, 'Fermer', {
      ...this.defaultConfig,
      ...config,
      panelClass: ['warning-snackbar']
    });
  }

  /**
   * Affiche une notification d'information
   * @param message Le message à afficher
   * @param config Configuration optionnelle
   */
  showInfo(message: string, config?: MatSnackBarConfig): void {
    this.snackBar.open(message, 'Fermer', {
      ...this.defaultConfig,
      ...config,
      panelClass: ['info-snackbar']
    });
  }
}
