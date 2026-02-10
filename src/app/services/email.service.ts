import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class EmailService {
  private readonly emailUser = 'suzinabot@gmail.com';

  constructor(private router: Router) {}

  sendCollaboratorInvite(
    toEmail: string,
    boardTitle: string,
    inviterName: string,
    inviteLink: string
  ): Promise<boolean> {
    // En production, utiliser un backend pour envoyer les emails via SMTP
    // Pour le moment, on va simplement simuler l'envoi

    const message = `
      Salut!

      ${inviterName} t'a invité à collaborer sur le tableau "${boardTitle}" dans Trell-A.

      Clique sur le lien ci-dessous pour accepter l'invitation:
      ${inviteLink}

      À bientôt sur Trell-A!
    `;

    console.log('Email simulé envoyé à:', toEmail);
    console.log('Message:', message);

    // Simuler un délai d'envoi
    return new Promise(resolve => {
      setTimeout(() => resolve(true), 500);
    });
  }

  sendWelcomeEmail(email: string, name: string): Promise<boolean> {
    const message = `
      Bienvenue ${name}!

      Ton compte Trell-A a été créé avec succès.
      Commence à créer tes premiers tableaux et à collaborer avec ton équipe!

      À bientôt!
    `;

    console.log('Email de bienvenue envoyé à:', email);
    console.log('Message:', message);

    return new Promise(resolve => {
      setTimeout(() => resolve(true), 500);
    });
  }
}
