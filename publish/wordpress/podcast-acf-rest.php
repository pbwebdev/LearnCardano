<?php
/**
 * Plugin Name: Podcast ACF REST bridge
 * Description: Exposes the `youtube_video` and `text_transcript` ACF fields
 *              on the `podcasts` custom post type via the standard WP REST
 *              API at /wp-json/wp/v2/podcasts/{id}, so the publishing
 *              automation can write them with a basic-auth POST.
 * Author:      Learn Cardano automation
 * Version:     1.0
 *
 * Install: copy this file to wp-content/mu-plugins/podcast-acf-rest.php
 * (mu-plugins are auto-loaded — no activation step needed).
 *
 * After installing, REST clients can update fields with:
 *   POST /wp-json/wp/v2/podcasts/{id}
 *   { "meta": { "youtube_video": "VIDEO_ID", "text_transcript": "..." } }
 *
 * The ACF admin UI continues to work as before — these are the same meta
 * keys ACF reads from, so manual edits and automated writes round-trip.
 */

defined('ABSPATH') || exit;

add_action('init', function () {
    $fields = [
        'youtube_video'   => 'string',
        'text_transcript' => 'string',
        // Add more here as you expose them; keep the list in sync with
        // the publish-to-wordpress.js automation.
    ];

    foreach ($fields as $key => $type) {
        register_post_meta('podcasts', $key, [
            'type'              => $type,
            'single'            => true,
            'show_in_rest'      => true,
            'auth_callback'     => function () {
                return current_user_can('edit_posts');
            },
            'sanitize_callback' => function ($value) {
                return is_string($value) ? wp_kses_post($value) : '';
            },
        ]);
    }
});
