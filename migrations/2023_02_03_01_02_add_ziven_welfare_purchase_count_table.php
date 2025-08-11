<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Schema\Builder;

return [
    'up' => function (Builder $schema) {
        if (!$schema->hasTable('wusong8899_welfare_purchase_count')) {
            $schema->create('wusong8899_welfare_purchase_count', function (Blueprint $table) {
                $table->increments('id');
                $table->integer('welfare_id')->unsigned();
                $table->integer('user_id')->unsigned();
                $table->float('total_purchase_count')->unsigned();
                $table->integer('total_win_count')->unsigned();

                $table->unique(['welfare_id', 'user_id']);
            });
        }
    },
    'down' => function (Builder $schema) {
        $schema->drop('wusong8899_welfare_purchase_count');
    },
];
