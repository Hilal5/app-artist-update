@extends('layouts.app')

@section('title', 'Hilal Prayogi - Portfolio')

@section('content')
    <div class="card">
        <div class="content">
            <h1>
                <span class="greeting">hi!</span> 
                <span class="name">i'm Hilal</span>
            </h1>
            <p class="subtitle">illustrator, animator, and developer</p>
            
            <!-- Navigation Component -->
            <x-navigation />

            <!-- Social Section -->
            <div class="social-section">
                <p class="copyright">© 2025 Hilal</p>
            </div>
        </div>
    </div>
@endsection