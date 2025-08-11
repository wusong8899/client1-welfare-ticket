<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Schema\Builder;

return [
    'up' => function (Builder $schema) {
        if (!$schema->hasTable('wusong8899_welfare')) {
            $schema->create('wusong8899_welfare', function (Blueprint $table) {
                $table->integer('id')->primary();
                $table->string('title', 255)->nullable();
                $table->string('desc', 255);
                $table->string('color', 20)->nullable();
                $table->string('image', 255)->nullable();
                $table->integer('type')->unsigned();
                $table->float('cost')->unsigned();
                $table->integer('purchased_total')->unsigned()->default(0);
                $table->float('bet_total')->unsigned()->default(0);
                $table->integer('dealer_id')->unsigned()->nullable();
                $table->string('result', 255)->nullable();
                $table->string('settings', 1000);
                $table->boolean('activated')->unsigned()->default(0);
                $table->dateTime('assigned_at');

                $table->index('assigned_at');
                $table->index('activated');
                $table->index('result');
                $table->foreign('dealer_id')->references('id')->on('users')->onDelete('cascade');
            });
        }
    },
    'down' => function (Builder $schema) {
        $schema->drop('wusong8899_welfare');
    },
];
