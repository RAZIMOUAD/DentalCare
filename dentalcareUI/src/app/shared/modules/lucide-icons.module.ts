// src/app/shared/modules/lucide-icons.module.ts

import { NgModule } from '@angular/core';
import { LucideAngularModule } from 'lucide-angular';
import { icons } from 'lucide'; // ✅ Icônes globales depuis le core 'lucide'

const selectedIcons = {
  Calendar: icons.Calendar,
  CalendarDays: icons.CalendarDays,
  ChevronRight: icons.ChevronRight,
  UserPlus: icons.UserPlus
};

@NgModule({
  imports: [LucideAngularModule.pick(selectedIcons)],
  exports: [LucideAngularModule]
})
export class LucideIconsModule {}
