<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Schema\Builder;

return [
    'up' => function (Builder $schema) {
        if (!$schema->hasTable('wusong8899_welfare_purchase')) {
            $schema->create('wusong8899_welfare_purchase', function (Blueprint $table) {
                $table->increments('id');
                $table->string('title', 255)->nullable();
                $table->integer('welfare_id')->unsigned();
                $table->integer('user_id')->unsigned();
                $table->float('bet')->default(0);
                $table->float('multiplier')->default(0);
                $table->string('numbers', 100);
                $table->float('win_total')->default(0);
                $table->boolean('opened')->default(0);
                $table->dateTime('assigned_at');

                $table->index('assigned_at');
                $table->foreign('welfare_id')->references('id')->on('wusong8899_welfare')->onDelete('cascade');
                $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');
            });
        }
    },
    'down' => function (Builder $schema) {
        $schema->drop('wusong8899_welfare_purchase');
    },
];
