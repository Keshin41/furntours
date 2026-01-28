<?php

namespace App\Http\Controllers\Admin\Settings;

use App\Http\Controllers\Controller;
use App\Models\Statistic;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class HeroVideoController extends Controller
{
    /**
     * Afficher la page de modification de la vidéo hero
     */
    public function show()
    {
        $statistic = Statistic::current();
        $videoUrl = $statistic->hero_video_url ?? '/videos/hero-background.webm';

        return inertia('Admin/Settings/SettingsHeroVideo', [
            'heroVideoUrl' => $videoUrl,
        ]);
    }

    /**
     * Sauvegarder la vidéo hero
     */
    public function update(Request $request)
    {
        $validated = $request->validate([
            'video' => 'nullable|file|mimes:mp4,webm,ogg|max:102400', // 100MB max
        ]);

        $statistic = Statistic::current();
       
        if ($request->hasFile('video')) {
            $file = $request->file('video');
            $filename = 'hero-background-' . time() . '.' . $file->getClientOriginalExtension();
            
            // Sauvegarder la vidéo dans public/videos
            $path = Storage::disk('public')->putFileAs('videos', $file, $filename);
            $validated['hero_video_url'] = '/storage/' . $path;

            // Supprimer l'ancienne vidéo si elle existe
            if ($statistic->hero_video_url) {
                $oldVideoPath = str_replace('/storage/', '', $statistic->hero_video_url);
                Storage::disk('public')->delete($oldVideoPath);
            }
        }

        $statistic->update($validated);

        return redirect()->route('admin.settings.index')->with('success', 'Vidéo hero mise à jour avec succès');
    }
}
