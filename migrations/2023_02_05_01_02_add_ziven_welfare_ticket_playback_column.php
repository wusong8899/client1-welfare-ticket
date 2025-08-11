<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Schema\Builder;

return [
    'up' => function (Builder $schema) {
        if (!$schema->hasColumn('wusong8899_welfare', 'playback')) {
            $schema->table('wusong8899_welfare', function (Blueprint $table) {
                $table->string('playback', 255)->nullable();
            });
        }
    },
    'down' => function (Builder $schema) {

    }
];
