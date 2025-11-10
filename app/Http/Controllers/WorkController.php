<?php

namespace App\Http\Controllers;

use App\Models\Work;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;

class WorkController extends Controller
{
    // Get all works
    public function index()
{
    try {
        Log::info('WorkController@index called');

        $works = Work::latest()->get();

        Log::info('Works retrieved: ' . $works->count());

        // Calculate stats with null safety
        $totalWorks = $works->count();
        $uniqueClients = $works->whereNotNull('client_name')
                               ->pluck('client_name')
                               ->unique()
                               ->count();

        // ✅ GET REAL AVERAGE RATING FROM REVIEWS
        $averageRating = \App\Models\Review::avg('rating');
        $totalReviews = \App\Models\Review::count();
        
        // Format to 1 decimal place
        $avgRating = $averageRating ? number_format($averageRating, 1) : '0';

        $stats = [
            'total_works' => $totalWorks,
            'happy_clients' => $uniqueClients,
            'avg_rating' => $avgRating, // ✅ Real rating from reviews
            'total_reviews' => $totalReviews, // ✅ Bonus: total reviews count
        ];

        return response()->json([
            'success' => true,
            'works' => $works,
            'stats' => $stats,
        ]);

    } catch (\Exception $e) {
        Log::error('WorkController@index error: ' . $e->getMessage());
        Log::error('Stack trace: ' . $e->getTraceAsString());

        return response()->json([
            'success' => false,
            'message' => 'Failed to load works',
            'error' => $e->getMessage(),
            'line' => $e->getLine(),
            'file' => $e->getFile(),
        ], 500);
    }
}

    // Get single work
    public function show($id)
    {
        try {
            $work = Work::findOrFail($id);

            return response()->json([
                'success' => true,
                'work' => $work,
            ]);
        } catch (\Exception $e) {
            Log::error('WorkController@show error: ' . $e->getMessage());

            return response()->json([
                'success' => false,
                'message' => 'Work not found',
                'error' => $e->getMessage(),
            ], 404);
        }
    }

    // Store new work
    public function store(Request $request)
{
    try {
        \Log::info('Work Store Request:', $request->all());
        \Log::info('Work Store Files:', $request->hasFile('media_files') ? ['count' => count($request->file('media_files'))] : ['no_files']);

        if (!Auth::check() || Auth::user()->role !== 'admin') {
            return response()->json([
                'success' => false,
                'message' => 'Unauthorized - Admin only',
            ], 403);
        }

        // ✅ VALIDATION UNTUK MIXED FILES
        $validator = \Validator::make($request->all(), [
            'title' => 'required|string|max:255',
            'description' => 'nullable|string|max:500',
            'category' => 'required|in:illustration,character,commission,fanart,concept,logo,other',
            'client_name' => 'nullable|string|max:255',
            'media_files' => 'required|array|min:1|max:5',
            'media_files.*' => 'file|mimes:jpeg,png,jpg,gif,webp,mp4,webm,mov,avi|max:51200',
        ]);

        if ($validator->fails()) {
            \Log::error('Validation failed:', $validator->errors()->toArray());
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $validator->errors(),
            ], 422);
        }

        $imageFilenames = [];
        $videoFilenames = [];

        // ✅ PROCESS MIXED FILES
        if ($request->hasFile('media_files')) {
            foreach ($request->file('media_files') as $file) {
                \Log::info('Processing file:', [
                    'name' => $file->getClientOriginalName(),
                    'mime' => $file->getMimeType(),
                    'size' => $file->getSize()
                ]);

                $filename = time() . '_' . Str::random(10) . '.' . $file->getClientOriginalExtension();
                
                // Simpan file
                $file->storeAs('works', $filename, 'public');
                
                // Check if file is image or video
                if (str_starts_with($file->getMimeType(), 'image/')) {
                    $imageFilenames[] = $filename;
                    \Log::info('File saved as image:', ['filename' => $filename]);
                } elseif (str_starts_with($file->getMimeType(), 'video/')) {
                    $videoFilenames[] = $filename;
                    \Log::info('File saved as video:', ['filename' => $filename]);
                } else {
                    \Log::warning('Unknown file type:', [
                        'filename' => $filename,
                        'mime' => $file->getMimeType()
                    ]);
                }
            }
        }

        // ❌ HAPUS VALIDASI INI - BOLEH VIDEO SAJA
        // if (empty($imageFilenames)) {
        //     \Log::warning('No images uploaded');
        //     return response()->json([
        //         'success' => false,
        //         'message' => 'At least one image is required',
        //     ], 422);
        // }

        // ✅ VALIDASI MINIMAL 1 FILE (IMAGE ATAU VIDEO)
        if (empty($imageFilenames) && empty($videoFilenames)) {
            \Log::warning('No files uploaded');
            return response()->json([
                'success' => false,
                'message' => 'At least one file (image or video) is required',
            ], 422);
        }

        \Log::info('Creating work with:', [
            'images' => $imageFilenames,
            'videos' => $videoFilenames
        ]);

        $work = Work::create([
            'title' => $request->title,
            'description' => $request->description,
            'category' => $request->category,
            'client_name' => $request->client_name,
            'images' => $imageFilenames,
            'videos' => $videoFilenames,
        ]);

        \Log::info('Work created successfully:', ['id' => $work->id]);

        return response()->json([
            'success' => true,
            'message' => 'Work added successfully!',
            'work' => $work,
        ]);

    } catch (\Exception $e) {
        \Log::error('WorkController@store error:', [
            'message' => $e->getMessage(),
            'file' => $e->getFile(),
            'line' => $e->getLine(),
            'trace' => $e->getTraceAsString()
        ]);

        return response()->json([
            'success' => false,
            'message' => 'Failed to create work: ' . $e->getMessage(),
            'error' => $e->getMessage(),
        ], 500);
    }
}

public function update(Request $request, $id)
{
    try {
        \Log::info('Work Update Request:', $request->all());
        \Log::info('Work Update Files:', [
            'media_files' => $request->hasFile('media_files') ? count($request->file('media_files')) : 0,
            'existing_images' => $request->input('existing_images', []),
            'existing_videos' => $request->input('existing_videos', []),
            'removed_images' => $request->input('removed_images', []),
            'removed_videos' => $request->input('removed_videos', [])
        ]);

        if (!Auth::check() || Auth::user()->role !== 'admin') {
            return response()->json([
                'success' => false,
                'message' => 'Unauthorized',
            ], 403);
        }

        $work = Work::findOrFail($id);

        $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string|max:500',
            'category' => 'required|in:illustration,character,commission,fanart,concept,logo,other',
            'client_name' => 'nullable|string|max:255',
            'media_files' => 'nullable|array|max:5',
            'media_files.*' => 'file|mimes:jpeg,png,jpg,gif,webp,mp4,webm,mov,avi|max:51200',
            'existing_images' => 'nullable|array',
            'existing_videos' => 'nullable|array',
            'removed_images' => 'nullable|array',
            'removed_videos' => 'nullable|array',
        ]);

        // ✅ BENAR - START dengan data dari DATABASE
        $imageFilenames = $work->images ?? [];
        $videoFilenames = $work->videos ?? [];

        \Log::info('Initial files from DATABASE:', [
            'images' => $imageFilenames,
            'videos' => $videoFilenames
        ]);

        // ✅ JIKA ADA DATA DARI REQUEST, GUNAKAN ITU (override)
        if ($request->has('existing_images')) {
            $imageFilenames = $request->input('existing_images', []);
        }
        if ($request->has('existing_videos')) {
            $videoFilenames = $request->input('existing_videos', []);
        }

        \Log::info('After request override:', [
            'images' => $imageFilenames,
            'videos' => $videoFilenames
        ]);

        // ✅ DELETE REMOVED FILES FROM SERVER
        $removedImages = $request->input('removed_images', []);
        $removedVideos = $request->input('removed_videos', []);

        foreach ($removedImages as $removedImage) {
            if (Storage::disk('public')->exists('works/' . $removedImage)) {
                Storage::disk('public')->delete('works/' . $removedImage);
                \Log::info('Deleted removed image:', ['file' => $removedImage]);
            }
        }

        foreach ($removedVideos as $removedVideo) {
            if (Storage::disk('public')->exists('works/' . $removedVideo)) {
                Storage::disk('public')->delete('works/' . $removedVideo);
                \Log::info('Deleted removed video:', ['file' => $removedVideo]);
            }
        }

        // ✅ PROCESS NEW FILES (sebagai tambahan, bukan pengganti)
        if ($request->hasFile('media_files')) {
            foreach ($request->file('media_files') as $file) {
                $filename = time() . '_' . Str::random(10) . '.' . $file->getClientOriginalExtension();
                $file->storeAs('works', $filename, 'public');
                
                if (str_starts_with($file->getMimeType(), 'image/')) {
                    $imageFilenames[] = $filename;
                    \Log::info('Added new image:', ['file' => $filename]);
                } elseif (str_starts_with($file->getMimeType(), 'video/')) {
                    $videoFilenames[] = $filename;
                    \Log::info('Added new video:', ['file' => $filename]);
                }
            }
        }

        // ✅ VALIDATE TOTAL FILES TIDAK MELEBIHI 5
        $totalFiles = count($imageFilenames) + count($videoFilenames);
        if ($totalFiles > 5) {
            \Log::error('Total files exceeded:', ['total' => $totalFiles]);
            return response()->json([
                'success' => false,
                'message' => 'Maximum 5 files allowed. You have ' . $totalFiles . ' files.',
            ], 422);
        }

        // ✅ VALIDATE MINIMAL 1 FILE
        if ($totalFiles === 0) {
            \Log::error('No files remaining after update');
            return response()->json([
                'success' => false,
                'message' => 'At least one file (image or video) is required',
            ], 422);
        }

        \Log::info('Final files to save:', [
            'images' => $imageFilenames,
            'videos' => $videoFilenames,
            'total' => $totalFiles
        ]);

        $work->update([
            'title' => $request->title,
            'description' => $request->description,
            'category' => $request->category,
            'client_name' => $request->client_name,
            'images' => $imageFilenames,
            'videos' => $videoFilenames,
        ]);

        \Log::info('Work updated successfully:', ['id' => $work->id]);

        return response()->json([
            'success' => true,
            'message' => 'Work updated successfully!',
            'work' => $work,
        ]);

    } catch (\Exception $e) {
        \Log::error('WorkController@update error:', [
            'message' => $e->getMessage(),
            'file' => $e->getFile(),
            'line' => $e->getLine(),
            'trace' => $e->getTraceAsString()
        ]);

        return response()->json([
            'success' => false,
            'message' => 'Failed to update work: ' . $e->getMessage(),
            'error' => $e->getMessage(),
        ], 500);
    }
}

    // ✅ UPDATE DELETE METHOD
public function destroy($id)
{
    try {
        if (!Auth::check() || Auth::user()->role !== 'admin') {
            return response()->json([
                'success' => false,
                'message' => 'Unauthorized',
            ], 403);
        }

        $work = Work::findOrFail($id);

        // Delete images
        if (is_array($work->images)) {
            foreach ($work->images as $image) {
                Storage::disk('public')->delete('works/' . $image);
            }
        }

        // ✅ DELETE VIDEO
        if ($work->video) {
            Storage::disk('public')->delete('works/' . $work->video);
        }

        $work->delete();

        return response()->json([
            'success' => true,
            'message' => 'Work deleted successfully!',
        ]);

    } catch (\Exception $e) {
        Log::error('WorkController@destroy error: ' . $e->getMessage());
        return response()->json([
            'success' => false,
            'message' => 'Failed to delete work',
            'error' => $e->getMessage(),
        ], 500);
    }
}
}