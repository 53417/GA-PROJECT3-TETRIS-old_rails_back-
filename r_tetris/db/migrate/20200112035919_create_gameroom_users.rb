class CreateGameroomUsers < ActiveRecord::Migration[6.0]
  def change
    create_table :gameroom_users do |t|

      t.timestamps
    end
  end
end
